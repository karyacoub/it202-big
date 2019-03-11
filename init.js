$(window).on('load', function() {
    window.mdc.autoInit();

    mdc.ripple.MDCRipple.attachTo($('#search-button')[0]);
    mdc.ripple.MDCRipple.attachTo($('#search-text-field')[0]);
});