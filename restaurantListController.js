$(document).ready(function() {

    // open map if map button is clicked
    $('#restaurant-list-content').on('click', '#open-map', openMap);

    // open info page if more info button is clicked
    $('#restaurant-list-content').on('click', '#more-info', moreInfo);
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

        var coordinates = { lat: latitude, lng: longitude };

        var marker = generateMarker(name, coordinates);
        
        initMap(coordinates);

        setMarker(marker);

        setInfowindow(name, address);
    });
}

function moreInfo()
{
    console.log("More info");

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

function getFullInfo(restaurantID, callback)
{
    
}
