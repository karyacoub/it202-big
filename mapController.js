var map;

/*$(document).ready(function() {
    if(!map || isMapMarked)
    {
        getLocation(function(coordiantes) {  
            initMap(coordiantes);
        });
    }
});*/

function initMap(center, marker)
{
    if(marker)
    {
        map = new google.maps.Map(document.getElementById('map'), {
            center: marker.position,
            zoom: 12
        });
    
        marker.setMap(map);
    }
    else
    {
        console.log('test');
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: center.lat, lng: center.lng},
            zoom: 12
        });
    }
}