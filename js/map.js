document.addEventListener("DOMContentLoaded", load);

function load() {
    L.mapbox.accessToken = "pk.eyJ1Ijoic3RlZmZlZWVuIiwiYSI6ImNqdm5vdXRlNzFrazAzeXFtd2MzcXR1OGIifQ.l12uXlqj2dUa8fx3nzT0xg";
    let map = L.mapbox.map("map").setView([-34.991197, 173.507099], 15).addLayer(L.mapbox.styleLayer("mapbox://styles/mapbox/streets-v11"));

    L.marker([-34.991197, 173.507099]).addTo(map);

    map.addEventListener("focus", function () {
        map.scrollWheelZoom.enable();
    });

    map.addEventListener("blur", function () {
        map.scrollWheelZoom.disable();
    });
}




