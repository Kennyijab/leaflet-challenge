// Initialize the map
var map = L.map('map').setView([37.7749, -122.4194], 5);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to determine marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 4;
}

// Function to determine marker color based on depth
function markerColor(depth) {
    return depth > 90 ? "#ff5f65" :
           depth > 70 ? "#fca35d" :
           depth > 50 ? "#fdb72a" :
           depth > 30 ? "#f7db11" :
           depth > 10 ? "#dcf400" :
                        "#a3f600";
}

// URL to fetch earthquake data
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch the data
d3.json(earthquakeUrl).then(function(data) {
    // Add a GeoJSON layer to the map
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3>
                             <hr><p>Magnitude: ${feature.properties.mag}</p>
                             <p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
        }
    }).addTo(map);
});

// Add a legend to the map
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 30, 50, 70, 90],
        labels = [];

    div.innerHTML += "<h4>Depth (km)</h4>";

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
