/// <reference path="jquery-3.2.1.js" />

var map;
var zoom = 12;
function onLoad() {
    map = new T.Map('mapDiv', {
        projection: 'EPSG:4326'
    });
    map.centerAndZoom(new T.LngLat(116.40769, 39.89945), zoom);
}
