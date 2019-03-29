$(document).ready(function() {

    // open map if map button is clicked
    $('#restaurant-list-content').on('click', '#open-map', function() {
        // retrieve the parent mdc card
        var restaurantCard = $(this).parent().parent().parent();

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

    // open info page if more info button is clicked
    $('#restaurant-list-content').on('click', '#more-info', function() {
        // retrieve the parent mdc card
        var restaurantCard = $(this).parent().parent().parent();

        console.log(restaurantCard);
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
