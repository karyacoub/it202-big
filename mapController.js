var map;
var currentMarker;

function initMap(coordinates)
{
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: coordinates.lat, lng: coordinates.lng },
        zoom: 12
    });
}

function setMarker(marker)
{
    if(currentMarker)
    {
        currentMarker.setMap(null);
    }
    
    currentMarker = marker;
    currentMarker.setMap(map);
}