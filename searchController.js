$(document).ready(function() {
    $('#search-button').on('click', function() {
        if(!isSearchEmpty())
        {
            // get current user's location
            // Note: getLocation must take a callback function since getCurrentPosition() is asynchronous
            getLocation(function(coordinates) { 
                // send out Google Places API call for restaurant search
                var searchTerm = getSearchTerm();
                searchRestaurants(searchTerm, coordinates, function(businesses) {
                    // load restauraunt list page
                    loadScreen('restaurant-list', function() { 
                        // add returned restaurants list to restaurant-list page
                        displaySearchResults(businesses); 
                    });
                });
            });
        }
    });
})

function isSearchEmpty()
{
    return $('#search-text-field').val().length <= 0;
}

function getSearchTerm()
{
    return $('#search-text-field').val();
}

function getLocation(callback)
{
    if ('geolocation' in navigator) 
    {
        // prompt user for location
        navigator.geolocation.getCurrentPosition(function(position) {
            var coordinates = { latitude: position.coords.latitude, longitude: position.coords.longitude };
            callback(coordinates);
        },
        function(error) {
            // display snackbar with location retrieval error
            console.log('Error retrieving location');
        });
    } 
    else 
    {
        // display snackbar with location retrieval error
        console.log('Error retrieving location');
    }
}

function searchRestaurants(searchTerm, coordinates, callback)
{
    // https://developers.google.com/maps/documentation/javascript/places

    var latitude = coordinates.latitude;
    var longitude = coordinates.longitude;

    var service = new google.maps.places.PlacesService(document.getElementById('map'));
    service.nearbySearch({
        location: {
            lat: latitude,
            lng: longitude
        },
        radius: 10000,
        keyword: searchTerm,
        type: 'restaurant'
    }, function(response) {
        callback(response);
    });
}

function displaySearchResults(businesses)
{
    // clone a template for card search result
    var cardTemplate = $('.mdc-card').clone();

    // clear restaurant list from previous search
   $('#restaurant-list').empty();

    businesses.forEach(function(business) {
        // clone card mdc div
        var card = cardTemplate.clone();

        // set card's information
        card.find('#restaurant-name').text(business.name);
        card.find('#restaurant-address').text(business.vicinity);
        card.find('.cropped-image').attr('src', business.photos[0].getUrl());

        console.log(business);

        // append card to restaurant list
        $('#restaurant-list').append(card);
    });
}