$(document).ready(function() {
    $('#search-button').on('click', function() {
        if(!isSearchEmpty())
        {
            // get current user's location
            // Note: getLocation must take a callback function since getCurrentPosition() is asynchronous
            getLocation(function(coordinates) { 
                // send out Yelp Fusion API call for restaurant search
                var searchTerm = getSearchTerm();
                searchRestaurants(searchTerm, coordinates, function(businesses) {
                    // add returned restaurants list to restaurant-list page
                    console.log(businesses);
                    displaySearchResults(businesses.businesses);
                });

                // load restauraunt list page
                loadScreen('restaurant-list');
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
    var latitude = coordinates.latitude;
    var longitude = coordinates.longitude;
    var url = `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&term=${searchTerm}&categories=food`;
    var proxyurl = 'https://cors-anywhere.herokuapp.com/';

    // Note: Proxy must be used to avoid browser blocking response from api due to CORS

    $.ajax({
        url: proxyurl + url,
        headers: {
            'Authorization' : 'Bearer tEig16TbTXlaUMjhaAWyccBhMt1-QnbyyFqguXFG_bA_AvQbDl9NB7K8MYrsGVihpBk5Funwyqa5WYtfIkUW7t6utrANeBhZQEBh-ndbOKbEZkLEfCixtoq0iF15XHYx'
        },
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            callback(response);
        }
     });
}

function displaySearchResults(businesses)
{
    businesses.forEach(function(business) {
        // create card mdc div
        

        // append card to restaurant list
        
    });
}