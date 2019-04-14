$(document).ready(function() {

    // open map if map button is clicked
    $('#restaurant-list-content').on('click', '#open-map', openMap);

    // open info page if more info button is clicked
    $('#restaurant-list-content').on('click', '#more-info-card', moreInfo);
});
