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

    var url = `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&term=${searchTerm}`;
    var proxyurl = 'https://cors-anywhere.herokuapp.com/';

    $.ajax({
        url: proxyurl + url,
        headers: {
            'Authorization' : 'Bearer tEig16TbTXlaUMjhaAWyccBhMt1-QnbyyFqguXFG_bA_AvQbDl9NB7K8MYrsGVihpBk5Funwyqa5WYtfIkUW7t6utrANeBhZQEBh-ndbOKbEZkLEfCixtoq0iF15XHYx',
            //'Origin' : 'localhost'
        },
        success: function(results) { callback(results.businesses) }
    });

    /*var service = new google.maps.places.PlacesService(document.getElementById('map'));
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
    });*/
}

function displaySearchResults(businesses)
{
    // clone a template for card search result
    var cardTemplate = $('.mdc-card').clone();
    cardTemplate.removeClass('hidden');

    // clear restaurant list from previous search
   $('#restaurant-list').empty();

   if(businesses.length == 0)
   {
       displayNoResults();
       return;
   }
   else
   {
       $('#no-results-div').addClass('hidden');
   }

   businesses.forEach(function(business) {
       // clone card mdc div
       var card = cardTemplate.clone();
       
       // set card's information
       card.find('#restaurant-name').text(business.name);

       var address = business.location.address1 + ' ' 
                   + business.location.address2 + ', ' 
                   + business.location.city + ', '
                   + business.location.state;
       card.find('#restaurant-address').text(address);

       if(business.image_url !== undefined)
       {
           card.find('.cropped-image').attr('src', business.image_url);
       }

       if(business.is_closed !== undefined)
       {
           var isOpen = business.is_closed ? 'Closed' : 'Open';
           card.find('#is-open').text(isOpen);
       }

       // append card to restaurant list
       $('#restaurant-list').append(card);
    });
}

function displayNoResults()
{
    $('#no-results-div h1').text('No results found for specified query. Please try another.');
}