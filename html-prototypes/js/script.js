$(document).ready(function(){
jQuery('#sucess').hide();
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches
$(".next").click(function(event){
var fv=formValidation(event);
if(fv){
}else{
return false;
}

if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	next_fs = $(this).parent().next();
	
	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'transform': 'scale('+scale+')'});
			next_fs.css({'left': left, 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});





});

$(".previous").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();
	
	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
	
	//show the previous fieldset
	previous_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});




});



function formData() {
    var serializedValues = jQuery("#msform").serialize();
		      var form_data = {
            action: 'ajax_data',
            type: 'post',
            data: serializedValues,
        };
        jQuery.post('insert.php', form_data, function(response) {
		 alert(response);
		// document.getElementById("sucess").style.color = "#006600";
		// jQuery('#sucess').show();
        });
	
    return serializedValues;
}


function formValidation(e){




var fname=jQuery('#fname').val();
if ($.trim(fname).length == 0) {
document.getElementById("fname").style.borderColor = "#E34234";
jQuery('.fs-error').html('<span style="color:red;"> Please Enter First Name !</span>');
jQuery('.fs-error').show();
return false;
}
else{
jQuery('.fs-error').hide();

	
	}

var emailval=jQuery('#email').val();
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  
// Checking Empty Fields
var vemail=mailformat.test(emailval)
if ($.trim(emailval).length == 0 || vemail==false) {
jQuery('.fs-error').html('<span style="color:red;"> Email is invalid !</span>');
return false;
}
else{

	jQuery('.fs-error').hide();
}


	var pass1 = document.getElementById("pass").value;
    var pass2 = document.getElementById("cpass").value;
	
    if (pass1 != pass2 || pass1 == '') {
        //alert("Passwords Do not match");
        document.getElementById("pass").style.borderColor = "#E34234";
        document.getElementById("cpass").style.borderColor = "#E34234";
	jQuery('.fs-error').html('<span style="color:red;"> Passords do not match !</span>');
	jQuery('.fs-error').show();
        return false
    }
    else {
      document.getElementById("pass").style.borderColor = "#006600";
        document.getElementById("cpass").style.borderColor = "#006600";
		jQuery('.fs-error').hide();
		return true;
    }



	
}
