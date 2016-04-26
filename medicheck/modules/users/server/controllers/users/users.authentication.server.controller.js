'use strict';

/**
 * Module dependencies.
 */
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var path = require('path'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    mongoose = require('mongoose'),
    passport = require('passport'),
    https = require("https"),
    request = require('request'),
    fs = require('fs'),
    User = mongoose.model('User'),
    parseString = require('xml2js').parseString;
    
// URLs for which user can't be redirected on signin
var noReturnUrls = [
    '/authentication/signin',
    '/authentication/signup'
];

var tokenGen = function() {
    var token = crypto.randomBytes(20);
    token = token.toString('hex');
    return token;
};

var sendVerificationEmail = function(user, req, res) {
    var emailId = req.body.email;
    var transporter = nodemailer.createTransport({
        host: 'mail.citynetwork.se',
        secureConnection: true,
        port: 465,
        auth: {
            user: "support@medicheck.se",
            pass: "2016theNewHealt#Care"
        }
    });

    user.verificationToken = tokenGen();
    user.verificationTokenExpires = Date.now() + 3600000; // 1 hour

    user.save();
    var httpTransport = 'http://';
    var mailOptions = {
        transport: transporter,
        text: "Hello " + user.firstName + " " + user.lastName + "!" +
        " Please click on the following link to verify your account: " +
        httpTransport + req.headers.host + '/api/verification/' + user.verificationToken,
        to: emailId,
        from: "<no-reply@medicheck.com>",
        subject: "Email Verification"
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });

};

exports.validateVerificationToken = function(req, res) {
    User.findOne({
        verificationToken: req.params.token,
        verificationTokenExpires: {
            $gt: Date.now()
        }
    }, function(err, user) {
        if (!user) {
            return res.redirect('/password/reset/invalid');
        }

        res.redirect('/');
    });
};

/**
 * Signup
 */
exports.signup = function(req, res) {
    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;

    // Init Variables
    var user = new User(req.body);
    var message = null;
    // Add missing user fields
    user.provider = 'local';
    user.displayName = user.firstName + ' ' + user.lastName;

    // Then save the user
    user.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            // sendVerificationEmail(user, req, res);
            //Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            return res.json(user);
            
            
        }
    });

};

/**
 * Signin with BankId
 */
exports.signinWithBankId = function(req, res, next) {
    var personalNumber =req.body.bankId;

    //The initial call to the bankId server with personal number to get orderRef
    var myXMLText = '<?xml version="1.0" encoding="utf-8"?>' +
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:typ="http://bankid.com/RpService/v4.0.0/types/">' +
        '<soapenv:Header/>' +
        '<soapenv:Body> ' +
        '<typ:AuthenticateRequest> ' +
        '<!--Optional:--> ' +
        '<personalNumber>'+personalNumber+'</personalNumber> ' +
        '<!--0 to 20 repetitions:--> ' +
        '<endUserInfo> ' +
        '<type>IP_ADDR</type>  ' +
        '<value>192.168.0.1</value>  ' +         //Optional Parameters
        '</endUserInfo> ' +
        '<!--Optional:--> ' +
        '<requirementAlternatives> ' +
        '<!--0 to 7 repetitions:--> ' +
        '<requirement> ' +
        '<!--1 to 10 repetitions:--> ' +
        '<condition> ' +
        '<!--<key>?</key> -->  ' +
        '<!--1 to 20 repetitions:-->  ' +
        '<!--<value>?</value> -->  ' +
        '<key>CertificatePolicies</key> 	<!--The certificate policy must be --> ' +
        '<value>1.2.3.4.*</value>  	<!--1.2.752.1.5 (Mobile BankID) --> ' + //Currently set to test BankID -- Change in Production
        '</condition> ' +
        '</requirement> ' +

        '<requirement>  ' +
        '<condition>  ' +
        '<key>AllowFingerprint</key> 	<!--// TouchID --> ' +
        '<value>no</value> 			<!--is not allowed --> ' +
        '</condition>  ' +
        '</requirement> ' +
        '</requirementAlternatives> ' +
        '</typ:AuthenticateRequest> ' +
        '</soapenv:Body> ' +
        '</soapenv:Envelope>';

    var resJson = "";
    var autoStartToken = "";
    var orderRef = "";
    var faultString = "";
    var intervalid;
    
    request({
        url: "https://appapi.test.bankid.com/rp/v4",
        host: "appapi.test.bankid.com",
        rejectUnauthorized: false,
        requestCert: true,
        method: "POST",
        headers: {
            "content-type": "application/xml",  // <--Very important!!!
            //'Accept-Encoding': "gzip,deflate",
            'Content-Length': Buffer.byteLength(myXMLText),
            //'User-Agent': 'Apache-HttpClient/4.1.1 (java 1.5)',
            'Connection': "Keep-Alive"
        },

        body: myXMLText,

        agentOptions: {
            pfx: fs.readFileSync('cert/FPTestcert2_20150818_102329.pfx'),
            passphrase: 'qwerty123',
        },


    }, function(error, response, body) {
        //extracting orderRef from the bankId server response XML
        parseString(body, function(err, result) {
            resJson = JSON.stringify(result);

            var tempStr = "JSON.parse(resJson)";
            var indeces = Array('soap:Envelope','soap:Body',0,'ns2:AuthResponse',0);
            
            for (var i=0;i<indeces.length; i++)
                if(eval(tempStr+"['"+indeces[i]+"']"))
                    tempStr += "['"+indeces[i]+"']";
                else
                {
                    tempStr += "['soap:Fault'][0]";
                    faultString = eval(tempStr).faultstring[0];
                    break;
                }
                
            if(faultString !==""){
                console.log(faultString); //Repeort the user (client) about the fault
            }
            else
            {
            var theValue = eval(tempStr);
            autoStartToken = theValue.autoStartToken;
            orderRef = theValue.orderRef;
            //Ping the BankId server every 3 seconds, with orderRef to get the User Data
            intervalid = setInterval(function() {
                var myXMLTextOrderRef = '<?xml version="1.0" encoding="utf-8"?>' +
                    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:typ="http://bankid.com/RpService/v4.0.0/types/">' +
                    '<soapenv:Header/>' +
                    '<soapenv:Body>' +
                    '<typ:orderRef>' + orderRef[0] + '</typ:orderRef>' +
                    '</soapenv:Body>' +
                    '</soapenv:Envelope>';
                request({
                    url: "https://appapi.test.bankid.com/rp/v4",
                    host: "appapi.test.bankid.com",
                    rejectUnauthorized: false,
                    requestCert: true,
                    method: "POST",
                    headers: {
                        "content-type": "application/xml",  // <--Very important!!!
                        //'Accept-Encoding': "gzip,deflate",
                        'Content-Length': Buffer.byteLength(myXMLTextOrderRef),
                        //'User-Agent': 'Apache-HttpClient/4.1.1 (java 1.5)',
                        'Connection': "Keep-Alive"
                    },

                    body: myXMLTextOrderRef,
                    agentOptions: {
                        pfx: fs.readFileSync('cert/FPTestcert2_20150818_102329.pfx'),
                        passphrase: 'qwerty123',
                    },


                }, function(error, response, body) {
                    if (!error) {
                        parseString(body, function(err, result) {
                            var resp = JSON.stringify(result);
                            var tempStrnew = "JSON.parse(resp)";
                            var indecesNew = Array('soap:Envelope','soap:Body',0,'ns2:CollectResponse',0);
                            var statusCod = "";
                            var faultStringRes = "";
                            
                            for (var i=0;i<indecesNew.length; i++)
                                if(eval(tempStrnew+"['"+indecesNew[i]+"']"))
                                    tempStrnew += "['"+indecesNew[i]+"']";
                                else
                                {
                                    tempStrnew += "['soap:Fault'][0]";
                                    faultStringRes = eval(tempStrnew).faultstring[0];
                                    break;
                                }
                            if(faultStringRes !== "")
                            {
                                console.log(faultStringRes); //Inform the client about this fault too!
                                clearInterval(intervalid);
                                return;
                            }

                            statusCod = eval(tempStrnew).progressStatus[0];

                            if (statusCod === "OUTSTANDING_TRANSACTION") {
                                console.log("Outstanding Transaction");

                            }
                            if (statusCod === "NO_CLIENT") {
                                console.log("No Client");
                                clearInterval(intervalid);
                            }
                            if (statusCod === "COMPLETE") {
                                console.log(body);
                                var providerUserProfile = 
                                {
                                    firstName: eval(tempStrnew)['userInfo'][0].givenName[0],
                                    lastName: eval(tempStrnew)['userInfo'][0].surname[0],
                                    displayName: eval(tempStrnew)['userInfo'][0].name[0],
                                    email: eval(tempStrnew)['userInfo'][0].emails ? eval(tempStrnew)['userInfo'][0].emails[0].value : undefined,
                                    username: eval(tempStrnew)['userInfo'][0].personalNumber[0],
                                    password: eval(tempStrnew)['userInfo'][0].surname[0]+"123!@#",
                                    //profileImageURL: (profile.id) ? '//graph.facebook.com/' + profile.id + '/picture?type=large' : undefined,
                                    provider: 'local',
                                    providerIdentifierField: 'username',
                                    providerData: {username: eval(tempStrnew)['userInfo'][0].personalNumber[0]},
                                    userRole: ['patient'],
                                };
                                
                                User.findOne({"username":providerUserProfile.username}, function (err, person) {
                                    if (!person)
                                    {
                                        providerUserProfile.isNewUser = true;
                                        res.json(providerUserProfile);  
                                    }
                                    else
                                    {
                                        providerUserProfile.isNewUser = false;
                                        res.json(providerUserProfile);  
                                    }
                                });
                                clearInterval(intervalid);
                                return;
                            }
                        });
                        }
                    });
                }, 3000);
            }
        });
    });
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err || !user) {
            res.status(400).send(info);
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            req.login(user, function(err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(user);
                }
            });
        }
    })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/authentication/signin');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function(strategy, scope) {
    return function(req, res, next) {
        // Set redirection path on session.
        // Do not redirect to a signin or signup page
        if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
            req.session.redirect_to = req.query.redirect_to;
        }
        // Authenticate
        passport.authenticate(strategy, scope)(req, res, next);
    };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
    return function(req, res, next) {
        // Pop redirect URL from session
        var sessionRedirectURL = req.session.redirect_to;
        delete req.session.redirect_to;

        passport.authenticate(strategy, function(err, user, redirectURL) {
            if (err) {
                return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
            }
            if (!user) {
                return res.redirect('/authentication/signin');
            }
            req.login(user, function(err) {
                if (err) {
                    return res.redirect('/authentication/signin');
                }

                return res.redirect(redirectURL || sessionRedirectURL || '/');
            });
        })(req, res, next);
    };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
    if (!req.user) {
        // Define a search query fields
        var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
        var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

        // Define main provider search query
        var mainProviderSearchQuery = {};
        mainProviderSearchQuery.provider = providerUserProfile.provider;
        mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        // Define additional provider search query
        var additionalProviderSearchQuery = {};
        additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        // Define a search query to find existing user with current provider profile
        var searchQuery = {
            $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
        };

        User.findOne(searchQuery, function(err, user) {
            if (err) {
                return done(err);
            } else {
                if (!user) {
                    var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

                    User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
                        user = new User({
                            firstName: providerUserProfile.firstName,
                            lastName: providerUserProfile.lastName,
                            username: availableUsername,
                            displayName: providerUserProfile.displayName,
                            email: providerUserProfile.email,
                            profileImageURL: providerUserProfile.profileImageURL,
                            provider: providerUserProfile.provider,
                            providerData: providerUserProfile.providerData
                        });

                        // And save the user
                        user.save(function(err) {
                            return done(err, user);
                        });
                    });
                } else {
                    return done(err, user);
                }
            }
        });
    } else {
        // User is already logged in, join the provider data to the existing user
        var user = req.user;

        // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
        if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
            // Add the provider data to the additional provider data field
            if (!user.additionalProvidersData) {
                user.additionalProvidersData = {};
            }

            user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

            // Then tell mongoose that we've updated the additionalProvidersData field
            user.markModified('additionalProvidersData');

            // And save the user
            user.save(function(err) {
                return done(err, user, '/settings/accounts');
            });
        } else {
            return done(new Error('User is already connected using this provider'), user);
        }
    }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
    var user = req.user;
    var provider = req.query.provider;

    if (!user) {
        return res.status(401).json({
            message: 'User is not authenticated'
        });
    } else if (!provider) {
        return res.status(400).send();
    }

    // Delete the additional provider
    if (user.additionalProvidersData[provider]) {
        delete user.additionalProvidersData[provider];

        // Then tell mongoose that we've updated the additionalProvidersData field
        user.markModified('additionalProvidersData');
    }

    user.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.login(user, function(err) {
                if (err) {
                    return res.status(400).send(err);
                } else {
                    return res.json(user);
                }
            });
        }
    });
};