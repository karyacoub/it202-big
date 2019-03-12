$(window).on('load', function() {
    window.mdc.autoInit();

    mdc.ripple.MDCRipple.attachTo($('#search-button')[0]);
});