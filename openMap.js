function openMap()
{
    var restaurant = $(this);

    // check if caller is the mdc card or the marker
    if(restaurant.is('button#map-button'))
    {
        // retrieve the parent div
        restaurant = $(this).parent();
        console.log(restaurant);
    }
    else if(restaurant.is('button#open-map'))
    {
        // retrieve the parent mdc card
        restaurant = $(this).parent().parent().parent();
    }

    loadScreen('map', function() {
        var latitude = parseFloat(restaurant.attr('lat'));
        var longitude = parseFloat(restaurant.attr('lng'));
        var name = restaurant.attr('name');
        var address = restaurant.attr('address');
        var id = restaurant.attr('restaurant-id');

        console.log(address);

        var coordinates = { lat: latitude, lng: longitude };

        var marker = generateMarker(name, coordinates);
        
        initMap(coordinates);

        setMarker(marker);

        setInfowindow(name, id, latitude, longitude, address);
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