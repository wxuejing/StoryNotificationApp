var map;
var latLng;

function selectMarker(index) {
    //localStorage.setItem('latitude', map.markers[index].getPosition().lat());
    //localStorage.setItem('longitude', map.markers[index].getPosition().lng());

    document.getElementById("latitude").value = map.markers[index].getPosition().lat();
    document.getElementById("longitude").value = map.markers[index].getPosition().lng();

    // window.location.assign('/publisher/edit');
}

function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });

    var index = map.markers.length;
    map.markers.push(marker);

    var infowindow = new google.maps.InfoWindow({
        content: '<p>Details:' + '<p>Latitude:' + location.lat + '</p>' + '<p>Longitude:' + location.lng +
            '</p>' + '<button id ="btnSelectMarker" onclick=selectMarker(\'' + index + '\')>Select this stop</button>'
    });

    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

    console.log(JSON.stringify(map.markers.length));
    return marker;
}

function deleteAllMarkers() {
    for (var i = 0; i < map.markers.length; i++) {
        map.markers[i].setMap(null);
    }
    markers = [];
}

function init() {
    latLng = {
        lat: 38.986126,
        lng: -76.942490
    };

    map = new google.maps.Map(document.getElementById('map'), {
        center: latLng,
        zoom: 13,
        mapTypeId: 'roadmap'
    });

    map.markers = [];

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setCenter(latLng);

            addMarker(latLng);
        }, function () {

            addMarker(latLng);
        });
    } else {
        addMarker(latLng);
    }

    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    map.addListener('click', function (event) {
        deleteAllMarkers();

        latLng = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };

        addMarker(latLng);
    });

    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        map.markers.forEach(function (marker) {
            console.log(marker);
            marker.setMap(null);
        });
        markers = [];

        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            latLng = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };

            addMarker(latLng);

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}

function reportLocation(lat, lng) {
    console.log(lat);
    console.log(lng);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/publisher/location', true);

    xhr.setRequestHeader("Content-Type",
        "application/json");

    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status ==
            200) {
            // alert('Location reported');
        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
            alert('Location could not be reported');
            console.log(xhr.responseText);
        }
    }

    var ll = JSON.stringify({
        lat: lat,
        lng: lng
    });

    console.log(ll);
    xhr.send(ll);
}

function submitMessage(file) {

}