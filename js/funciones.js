/*
 *  geolocalizacion del mapa
 *
 *  @version: 0.1
 *  @author: Yohanna Etchemendy, Nicolás Lound
 *
 *
 */

'use strict'

// Visualiza el punto donde está el usuario
function mapToPosition(position) {
    lon = position.coords.longitude;
    lat = position.coords.latitude;

    map.setView(new L.LatLng(lat, lon), 7);
    new L.CircleMarker([lat, lon], {
        radius: 4
    }).addTo(map);
}

// detecta la posicion del usuario
function detectUserLocation() {
    if (navigator.geolocation) {
        var timeoutVal = 10 * 1000 * 1000;
        navigator.geolocation.watchPosition(
            mapToPosition, {
                enableHighAccuracy: true,
                timeout: timeoutVal,
                maximumAge: 0
            }
        );
    } else {
        alert("Su browser no permite geolocalizarlo");
    }
}

