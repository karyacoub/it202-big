$(document).ready(function() {

    // add click event listener on list items
    $('#restaurant-list-content').on('click', '.mdc-card', function() {
        var restaurantCard = $(this);

        loadScreen('map', function() {
            $('#no-results-div').addClass('hidden');

            var marker = generateMarker(restaurantCard);
            
            initMap(marker.position);

            setMarker(marker);
        });
    });
});

function generateMarker(restaurantCard)
{
    var latitude = parseInt(restaurantCard.attr('lat'));
    var longitude = parseInt(restaurantCard.attr('lng'));
    var name = restaurantCard.find('#restaurant-name').text();

    var marker = new google.maps.Marker({
        position: {lat: latitude, lng: longitude},
        title: name
      });

    return marker;
}
