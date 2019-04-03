$(document).ready(function() {

    // open map if map button is clicked
    $('#restaurant-list-content').on('click', '#open-map', openMap);

    // open info page if more info button is clicked
    $('#restaurant-list-content').on('click', '#more-info-card', moreInfo);
});

function openMap()
{
    // retrieve the parent mdc card
    var restaurantCard = $(this).parent().parent().parent();

    loadScreen('map', function() {
        $('#no-results-div').addClass('hidden');

        var latitude = parseFloat(restaurantCard.attr('lat'));
        var longitude = parseFloat(restaurantCard.attr('lng'));
        var name = restaurantCard.find('#restaurant-name').text();
        var address = restaurantCard.find('#restaurant-address').text();
        var id = restaurantCard.attr('restaurant-id');

        var coordinates = { lat: latitude, lng: longitude };

        var marker = generateMarker(name, coordinates);
        
        initMap(coordinates);

        setMarker(marker);

        setInfowindow(name, id, latitude, longitude, address);
    });
}

function moreInfo()
{
    var restaurant = $(this);

    // check if caller is the mdc card or the marker
    if(restaurant.is('button#more-info-infowindow'))
    {
        // retrieve the parent div
        restaurant = $(this).parent().parent();
    }
    else if(restaurant.is('button#more-info-card'))
    {
        // retrieve the parent mdc card
        restaurant = $(this).parent().parent().parent();
    }

    var restaurantID = restaurant.attr('restaurant-id');
    var latitude = restaurant.attr('lat');
    var longitude = restaurant.attr('lng');

    // make api call to get restaurant info
    getYelpInfo(restaurantID, function(restaurantInfo) {
        // use the address od selected restaurant as the zomato search key
        var searchAddress = restaurantInfo.location.address1 + ' ' + restaurantInfo.location.zip_code;

        getZomatoInfo(latitude, longitude, searchAddress);
    });

    // name
    // photos[] (image list)
    // url (to view all reviews)
    // display_phone
    // review count
    // categories[].title (chips)
    // rating
    // location.display_address[]
    // price
    // hours.open[]
    //  hours.open[].is_overnight
    //  hours.open[].start (military time)
    //  hours.opn[].end (military time)
    //  hours.open[].day (0 is Monday, 6 is Sunday)
    // hours.hours_type (e.g. regular, holiday, etc)
    // hours.is_open_now

}

function generateMarker(name, coordinates)
{
    var marker = new google.maps.Marker({
        position: { lat: coordinates.lat, lng: coordinates.lng },
        title: name
    });

    return marker;
}

function getYelpInfo(restaurantID, callback)
{
    var url = `https://api.yelp.com/v3/businesses/${restaurantID}`;
    var proxyurl = 'https://cors-anywhere.herokuapp.com/';

    $.ajax({
        url: proxyurl + url,
        headers: {
            'Authorization' : 'Bearer tEig16TbTXlaUMjhaAWyccBhMt1-QnbyyFqguXFG_bA_AvQbDl9NB7K8MYrsGVihpBk5Funwyqa5WYtfIkUW7t6utrANeBhZQEBh-ndbOKbEZkLEfCixtoq0iF15XHYx',
        },
        success: function(results) { callback(results) }
    });
}

function searchZomato(lat, lng, callback)
{
    var url = `https://developers.zomato.com/api/v2.1/geocode?lat=${lat}&lon=${lng}`;

    $.ajax({
        url: url,
        headers: {
            'user-key' : 'b2945786c3ef3677531a78c49766d82a',
        },
        success: function(results) { callback(results) }
    });
}

function getZomatoInfo(lat, lng, address)
{
    // use the address of the restaurant of the yelp api to find restaurant in zomato api
    searchZomato(lat, lng, function(results) {
        console.log(results);
    });

    // if restaurant not found on zomato, show user that no additional information was found

    // otherwise, run success callback function
}
