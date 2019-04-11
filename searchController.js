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

function getIsOpen()
{
    return $('#open_now')[0].checked;
}

function getLocation(callback)
{
    if ('geolocation' in navigator) 
    {
        // prompt user for location
        navigator.geolocation.getCurrentPosition(function(position) {
            var coordinates = { lat: position.coords.latitude, lng: position.coords.longitude };
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
    var latitude = coordinates.lat;
    var longitude = coordinates.lng;
    var isOpen = getIsOpen();

    var url = `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&term=${searchTerm}&open_now=${isOpen}`;
    var proxyurl = 'https://cors-anywhere.herokuapp.com/';

    $.ajax({
        url: proxyurl + url,
        headers: {
            'Authorization' : 'Bearer tEig16TbTXlaUMjhaAWyccBhMt1-QnbyyFqguXFG_bA_AvQbDl9NB7K8MYrsGVihpBk5Funwyqa5WYtfIkUW7t6utrANeBhZQEBh-ndbOKbEZkLEfCixtoq0iF15XHYx',
        },
        success: function(results) { callback(results.businesses) }
    });
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
       card.attr('restaurant-id', business.id);

       card.attr('lat', business.coordinates.latitude);
       card.attr('lng', business.coordinates.longitude);

       card.find('#restaurant-name').text(business.name);
       
       var address1 = business.location.address1;
       var address2 = business.location.address2 ? ' ' + business.location.address2 : ''; 
       var city = business.location.city;
       var state = business.location.state;
       var address = address1 + address2 + ', ' + city + ', ' + state;
       
       card.find('#restaurant-address').text(address);

       // to make opening card from more info page possible
       card.attr('name', business.name);

       if(business.image_url !== undefined)
       {
           card.find('.cropped-image').attr('src', business.image_url);
       }

       // append card to restaurant list
       $('#restaurant-list').append(card);
    });
}

function displayNoResults()
{
    $('#no-results-div h1').text('No results found for specified query. Please try another.');
}