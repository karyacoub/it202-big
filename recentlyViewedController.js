$(document).ready(function() {
    // clone a template for card search result
    var cardTemplate = $('.mdc-card').clone();
    cardTemplate.removeClass('hidden');

    var noResultsDiv = $('#no-results-div');

    db.recentlyViewed.each(function(business) {
        if(!noResultsDiv.hasClass('hidden'))
        {
            noResultsDiv.addClass('hidden');
        }

        // clone card mdc div
        var card = cardTemplate.clone();
        
        // set card's information
        card.attr('restaurant-id', business.id);
        card.attr('lat', business.lat);
        card.attr('lng', business.lng);

        card.find('#restaurant-name').text(business.name);
        card.find('#restaurant-address').text(business.address);
        card.find('.cropped-image').attr('src', business.img);

        // to make opening card from more info page possible
        card.attr('name', business.name);
        card.attr('image-src', business.img);
        card.attr('address', business.address);

        // append card to restaurant list
        $('#restaurant-list').append(card);
    });
});

