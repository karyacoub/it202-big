var map;

$(document).ready(function() {
    getLocation(function(coordiantes) {  
        initMap(coordiantes);
    });
});

function initMap(center)
{
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: center.latitude, lng: center.longitude},
        zoom: 12
    });
}