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

function setInfowindow(name, id, lat, lng, address)
{
    var contentString = $('<div restaurant-id="' + id + '" lat="' + lat + '" lng="' + lng + '" class="h-centered">' +
                            '<h2>' + name + '</h2>' +
                            '<h3>' + address + '</h3>' +
                            '<div>' + 
                                '<button id="more-info-infowindow" class="mdc-button mdc-card__action mdc-card__action--button">' + 
                                    'More Info' + 
                                '</button>' +
                            '</div>' +
                        '</div>');

    var infowindow = new google.maps.InfoWindow({
        content: contentString[0]
    });

    // add more info button click event listener
    var button = contentString.find('button.mdc-button')[0];
    google.maps.event.addDomListener(button, "click", moreInfo);

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