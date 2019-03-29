$(document).ready(function() {

    // add click event listener on list items
    $('#restaurant-list-content').on('click', '.mdc-card', function() {
        var restaurantCard = $(this);

        loadScreen('map', function() {
            $('#no-results-div').addClass('hidden');

            var latitude = parseFloat(restaurantCard.attr('lat'));
            var longitude = parseFloat(restaurantCard.attr('lng'));
            var name = restaurantCard.find('#restaurant-name').text();

            var coordinates = { lat: latitude, lng: longitude };

            var marker = generateMarker(name, coordinates);
            
            initMap(coordinates);

            setMarker(marker);

            setInfowindow();
        });
    });
});

function generateMarker(name, coordinates)
{
    var marker = new google.maps.Marker({
        position: { lat: coordinates.lat, lng: coordinates.lng },
        title: name
    });

    return marker;
}
