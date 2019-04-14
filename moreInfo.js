function moreInfo()
{
    var restaurant = $(this);

    // check if caller is the mdc card or the marker
    if(restaurant.is('button#more-info-infowindow'))
    {
        // retrieve the parent div
        restaurant = $(this).parent().parent();
    }
    else if(restaurant.is('button#more-info-card'))
    {
        // retrieve the parent mdc card
        restaurant = $(this).parent().parent().parent();
    }

    var restaurantID = restaurant.attr('restaurant-id');
    var latitude = restaurant.attr('lat');
    var longitude = restaurant.attr('lng');
    var name = restaurant.attr('name');
    var address = restaurant.attr('address');
    var imageSource = restaurant.attr('image-src');

    addToDB('recentlyViewed', restaurantID, name, address, latitude, longitude, imageSource);

    // make api call to get restaurant info
    getYelpInfo(restaurantID, function(yelpInfo) {
        // use coordinates to search for restaurant on zomato
        getZomatoInfo(latitude, longitude, function(zomatoInfo) {
            loadScreen('restaurant-info', function() {
                displayInfo(yelpInfo, zomatoInfo);
            });
        });
    });
}

function displayInfo(yelpInfo, zomatoInfo)
{
    // yelp info should always exist at this point, so no need to check for existence
    var id = yelpInfo.id;
    var name = yelpInfo.name;
    var isOpen = yelpInfo.hours[0].is_open_now ? 'Open' : 'Closed';
    var rating = yelpInfo.rating + '/5 ★';
    var pricing = yelpInfo.price;
    var numReviews = yelpInfo.review_count;
    var yelpURL = yelpInfo.url;
    var address = '';
    yelpInfo.location.display_address.forEach(function (e) { 
        address += (e + ' '); 
    });
    var phone = yelpInfo.display_phone;
    var cuisines = yelpInfo.categories;
    var cuisineChip = $('#cuisine-type').clone();
    var images = yelpInfo.photos;
    var imageListImage = $('#yelp-image').clone();
    var hoursType = yelpInfo.hours[0].hours_type;
    var hours = yelpInfo.hours[0].open;
    var latitude = yelpInfo.coordinates.latitude;
    var longitude = yelpInfo.coordinates.longitude;

    $('#restaurant-name').text(name);
    $('#is-open').text(isOpen);
    $('#rating').text(rating);
    $('#pricing').text(pricing);
    $('#number-reviews').children()[0].text = numReviews + ' Reviews';
    $('#number-reviews').children()[0].href = yelpURL;
    $('#restaurant-address').text(address);
    $('#address-and-map').attr('lat', latitude);
    $('#address-and-map').attr('lng', longitude);
    $('#address-and-map').attr('restaurant-id', id);
    $('#address-and-map').attr('name', name);
    $('#address-and-map').attr('address', address);
    $('#map-button').on('click', openMap);
    $('#phone').text(phone);
    $('#cuisine-type').addClass('hidden');
    cuisines.forEach(function (e) {
        var currentChip = cuisineChip.clone();
        currentChip.children()[0].innerHTML = e.title;
        $('.mdc-chip-set').append(currentChip);
    });
    $('#yelp-image').addClass('hidden');
    images.forEach(function(e) {
        var currentImage = imageListImage.clone();
        currentImage.children().children()[0].src = e;
        $('#image-list').append(currentImage);
    });
    $('#hours-type').text(hoursType);
    $('.open-times').each(function(i, v) {
        var startTime = hours[i].start;
        var endTime =hours[i].end;
        startTime = militaryToStandardTime(startTime);
        endTime = militaryToStandardTime(endTime);
        v.innerHTML = startTime + ' - ' + endTime;
    });

    // check if zomato info is empty (i.e. zomato api found an entry for the selected restaurant)
    if(Object.entries(zomatoInfo).length !== 0 || zomatoInfo.constructor !== Object)
    {  
        var avgCostForTwo = '$' + zomatoInfo.average_cost_for_two;
        var menuLink = zomatoInfo.menu_url;
        var hasOnlineDelivery = zomatoInfo.has_online_delivery === 1 ? 'Yes' : 'No';
        var hasTableReservations = zomatoInfo.is_table_reservation_supported === 1 ? 'Yes' : 'No';

        $('#avg-cost-for-two').text(avgCostForTwo);
        $('#menu').children()[0].href = menuLink;
        $('#menu').children()[0].innerHTML = 'Menu @ Zomato';
        $('#has-online-delivery').text(hasOnlineDelivery);
        $("#has-table-reservations").text(hasTableReservations);
    }
}