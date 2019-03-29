var map;
var currentMarker;
var isInfowindowOpen = false;

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

function setInfowindow()
{
    var contentString = '';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    currentMarker.addListener('click', function() {
        if(!isInfowindowOpen)
        {
            infowindow.open(map, currentMarker);
            isInfowindowOpen = true;
        }
        else
        {
            infowindow.close();
            isInfowindowOpen = false;
        }
    });
}