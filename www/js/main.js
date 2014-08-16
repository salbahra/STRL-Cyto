/*global $, navigator, FastClick, StatusBar */
var isIEMobile = /IEMobile/.test(navigator.userAgent),
    isAndroid = /Android|\bSilk\b/.test(navigator.userAgent),
    isiOS = /iP(ad|hone|od)/.test(navigator.userAgent);

// Prevent caching of AJAX requests on Android and Windows Phone devices
if (isAndroid) {
    $(this).ajaxStart(function(){
        try {
            navigator.app.clearCache();
        } catch (err) {}
    });
} else if (isIEMobile || isWinApp) {
    $.ajaxSetup({
        "cache": false
    });
}

$(document)
.ready(function() {
    //Attach FastClick handler
    FastClick.attach(document.body);

    //Use system browser for links on iOS and Windows Phone
    if (isiOS || isIEMobile) {
        $.mobile.document.on("click",".iab",function(){
            window.open(this.href,"_system","enableViewportScale=yes");
            return false;
        });
    } else if (isAndroid) {
        $.mobile.document.on("click",".iab",function(){
            window.open(this.href,"_blank","enableViewportScale=yes");
            return false;
        });
    }
})
.one("deviceready", function() {
    try {
        //Change the status bar to match the headers
        StatusBar.overlaysWebView(false);
        StatusBar.styleDefault();
        StatusBar.backgroundColorByHexString("#F9F9F9");
    } catch (err) {}

    // Hide the splash screen
    setTimeout(function(){
        try {
            navigator.splashscreen.hide();
        } catch(err) {}
    },500);

    // For Android, Blackberry and Windows Phone devices catch the back button and redirect it
    $.mobile.document.on("backbutton",function(){
        window.history.back();
        return false;
    });

    isReady = true;
})
.one("mobileinit", function(){
    //After jQuery mobile is loaded set intial configuration
    $.mobile.activeBtnClass = "disabled";
})
.on("resume",function(){
// Handle OS resume event triggered by PhoneGap
})
.on("pause",function(){
//Handle OS pause
})
.on("pagebeforeshow",function(e){
    var id = "#"+e.target.id,
        page = $(id);

    fixInputClick(page);
});

//Set AJAX timeout
$.ajaxSetup({
    timeout: 10000
});

function fixInputClick(page) {
    // Handle Fast Click quirks
    if (!FastClick.notNeeded(document.body)) {
        page.find("input[type='checkbox']:not([data-role='flipswitch'])").addClass("needsclick");
        page.find(".ui-select > .ui-btn").each(function(a,b){
            var ele = $(b),
                id = ele.attr("id");

            ele.attr("data-rel","popup");
            ele.attr("href","#"+id.slice(0,-6)+"listbox");
        });
    }
}

