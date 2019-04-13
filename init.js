$(window).on('load', function() {
    mdc.ripple.MDCRipple.attachTo($('#search-button')[0]);
});

// initialize an IndexedDB for recently viewed and favorited restaurants
var db = new Dexie("restaurantsDB");
db.version(1).stores({
    recentlyViewed: 'id, name, address, lat, lng, img',
    favorited: 'id, name, address, lat, lng, img'
});

// open indexedDB
db.open().catch(function(err) {
    console.error(err.stack || err);
});

function addToDB(dbName, restaurantID, restaurantName, restaurantAddress, latitude, longitude, imageSource)
{
    var store = dbName === 'favorited' ? db.favorited : db.recentlyViewed;
    store.put({
        id: restaurantID, 
        name: restaurantName, 
        address: restaurantAddress, 
        lat: latitude, 
        lng: longitude, 
        img: imageSource
    });
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
        url: url,
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
        url: url,
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

function militaryToStandardTime(time)
{
    var hours = parseInt(time.substring(0, 2));
    var minutes = time.substring(2, 4);
    var amOrPm = 'AM';

    if(hours >= 12)
    {
        amOrPm = 'PM'
        
        if(hours > 12)
        {
            hours -= 11;
        }
    }
    else if(hours === 0)
    {
        hours = 12;
    }

    return hours + ':' + minutes + ' ' + amOrPm;
}