"use strict";
$(document).ready(function() {
    $(window).on('resize', function() {
        var push_menu = $('#pushcontainer');
        if ($(window).width() < 801) {
            push_menu.removeClass('push-body-toright');
            push_menu.find("button").removeClass("menu-active");
            push_menu.find("nav").removeClass("menu-open");
        } else {
            push_menu.addClass('push-body-toright');
            push_menu.find("button").addClass("menu-active");
            push_menu.find("nav").addClass("menu-open");
        }
    });
    var push_menu = $('#pushcontainer');
    if ($(window).width() < 801) {
        push_menu.removeClass('push-body-toright');
        push_menu.find("button").removeClass("menu-active");
        push_menu.find("nav").removeClass("menu-open");
    } else {
        push_menu.addClass('push-body-toright');
        push_menu.find("button").addClass("menu-active");
        push_menu.find("nav").addClass("menu-open");
    }
});

