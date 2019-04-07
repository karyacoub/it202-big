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
    getYelpInfo(restaurantID, function(yelpInfo) {
        // use coordinates to search for restaurant on zomato
        getZomatoInfo(latitude, longitude, function(zomatoInfo) {
            loadScreen('restaurant-info', function() {
                displayInfo(yelpInfo, zomatoInfo);
            });
        });
    });

    // YELP: 
    // name
    // rating
    // photos[] (image list)
    // display_phone
    // location.display_address[]
    // categories[].title (chips)
    // price
    // review count
    // url (to view all reviews)
    //  hours.open[].start (military time)
    //  hours.opn[].end (military time)
    //  hours.open[].day (0 is Monday, 6 is Sunday)
    // hours.hours_type (e.g. regular, holiday, etc)
    // hours.is_open_now

    // ZOMATO:
    // average_cost_for_two
    // photos_url
    // menu_url
    // has_online_delivery
    // is_table_reservation_supported
}

function displayInfo(yelpInfo, zomatoInfo)
{
    console.log(yelpInfo);

    var name = yelpInfo.name;
    var isOpen = yelpInfo.hours[0].is_open_now ? 'Open' : 'Closed';
    var rating = yelpInfo.rating + '/5 ★';
    var pricing = yelpInfo.price;
    var numReviews = yelpInfo.review_count;
    var yelpURL = yelpInfo.url;
    var address = '';
    yelpInfo.location.display_address.forEach(function (e) { 
        address += (e + ' '); 
    });
    var phone = yelpInfo.display_phone;
    var cuisines = yelpInfo.categories;
    var cuisineChip = $('#cuisine-type').clone();
    var images = yelpInfo.photos;
    var imageListImage = $('#yelp-image').clone();
    var hoursType = yelpInfo.hours[0].hours_type;
    var hours = yelpInfo.hours[0].open;

    console.log(hoursType);

    $('#restaurant-name').text(name);
    $('#is-open').text(isOpen);
    $('#rating').text(rating);
    $('#pricing').text(pricing);
    $('#number-reviews').children()[0].text = numReviews + ' Reviews';
    $('#number-reviews').children()[0].href = yelpURL;
    $('#address').text(address);
    $('#phone').text(phone);
    $('#cuisine-type').addClass('hidden');
    cuisines.forEach(function (e) {
        var currentChip = cuisineChip.clone();
        currentChip.children()[0].innerHTML = e.title;
        $('.mdc-chip-set').append(currentChip);
    });
    $('#yelp-image').addClass('hidden');
    images.forEach(function(e) {
        var currentImage = imageListImage.clone();
        currentImage.children().children()[0].src = e;
        $('#image-list').append(currentImage);
    });
    $('#hours-type').text(hoursType);
    $('.open-times').each(function(i, v) {
        var startTime = hours[i].start;
        var endTime =hours[i].end;
        startTime = militaryToStandardTime(startTime);
        endTime = militaryToStandardTime(endTime);
        v.innerHTML = startTime + ' - ' + endTime;
    });
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

function zomatoLocationSearch(lat, lng, callback)
{
    var url = `https://developers.zomato.com/api/v2.1/geocode?lat=${lat}&lon=${lng}`;
    var proxyurl = 'https://cors-anywhere.herokuapp.com/';

    $.ajax({
        url: proxyurl + url,
        headers: {
            'user-key' : 'b2945786c3ef3677531a78c49766d82a',
        },
        success: function(results) { callback(results) }
    });
}

function zomatoMoreInfo(id, callback)
{
    var url = `https://developers.zomato.com/api/v2.1/restaurant?res_id=${id}`;
    var proxyurl = 'https://cors-anywhere.herokuapp.com/';

    $.ajax({
        url: proxyurl + url,
        headers: {
            'user-key' : 'b2945786c3ef3677531a78c49766d82a',
        },
        success: function(results) { callback(results) }
    });
}

function getZomatoInfo(lat, lng, callback)
{
    // use the address of the restaurant of the yelp api to find restaurant in zomato api
    zomatoLocationSearch(lat, lng, function(results) {
        // determine if returned array contains restaurant
        var nearbyRestaurants = results.nearby_restaurants;

        // the coordinates from the yelp api and the coordinates from the zomato api are the same up to 2 decimal places,
        // so reduce each coordinate string to 2 decimal places for comparison with zomato coordinates
        lat = lat[0] === '-' ? lat.substring(0, 6) : lat.substring(0, 5);
        lng = lng[0] === '-' ? lng.substring(0, 6) : lng.substring(0, 5);

        var foundRestaurant = nearbyRestaurants.find(function(restaurant) {
            var zomatoLat = restaurant.restaurant.location.latitude;
            var zomatoLng = restaurant.restaurant.location.longitude;

            zomatoLat = zomatoLat[0] === '-' ? zomatoLat.substring(0, 6) : zomatoLat.substring(0, 5);
            zomatoLng = zomatoLng[0] === '-' ? zomatoLng.substring(0, 6) : zomatoLng.substring(0, 5);

            return lat === zomatoLat && lng === zomatoLng;
        });

        // if restaurant is found, display more info on the restaurant
        if (foundRestaurant !== undefined)
        {
            zomatoMoreInfo(foundRestaurant.restaurant.id, function(zomatoInfo) {
                callback(zomatoInfo);
            });
        }
        else
        {
            callback({});
        }
    });
}
