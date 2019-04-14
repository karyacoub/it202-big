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