function createMap(earthquakes) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the earthquakes layer
  var overlayMaps = {
    "Significant Quakes": earthquakes
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [32,-1],
    zoom: 2,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);





  
 // Set up the legend
 var legend = L.control({ position: "bottomright" });
 legend.onAdd = function() {
   var div = L.DomUtil.create("div", "info legend");
   // var limits = geojson.options.limits;
   // var colors = geojson.options.colors;
   var labels = [];

    // Add min & max
    var legendInfo = "<h2>Magnitude</h2>" 
    +
      "<div class=\"labels\">" +
        "<div class=\"min\">0</div>" +
        "<div class=\"max\">7+</div>" +
      "</div>"
      ;

    div.innerHTML = legendInfo;

    // limits.forEach(function(limit, index) {
    //   labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    // });

    div.innerHTML += "<ul>" + "<li style=\"background-color: " + "#66ff33" + "\"></li>" +
    "<li style=\"background-color: " + "#ccff66" + "\"></li>" +
    "<li style=\"background-color: " + "#ffff66" + "\"></li>" +
    "<li style=\"background-color: " + "#ffcc00" + "\"></li>" +
    "<li style=\"background-color: " + "#ff9933" + "\"></li>" +
    "<li style=\"background-color: " + "#ff6600" + "\"></li>" +
    "<li style=\"background-color: " + "#ff0000" + "\"></li>" +
    "<li style=\"background-color: " + "#800000" + "\"></li></ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(map);
}

function createMarkers(response) {

  // Pull the locations off of response
  var locations = response.features;

  // Initialize an array to hold bike markers
  var quakeMarkers = [];

  // Loop through the locations array
  for (var i = 0; i < locations.length; i++) {
    var location = locations[i];

    // function colorPicker(location) {
      if (location.properties.mag < 1){
        var colorChoice = "#66ff33";
      }
        else if (location.properties.mag <2){
          var colorChoice = "#ccff66";
        }
        else if (location.properties.mag <3){
          var colorChoice = "#ffff66";
        }
        else if (location.properties.mag <4){
          var colorChoice = "#ffcc00";
        }
        else if (location.properties.mag <5){
          var colorChoice = "#ff9933";
        }
        else if (location.properties.mag <6){
          var colorChoice = "#ff6600";
        }
        else if (location.properties.mag <7){
          var colorChoice = "#ff0000";
        }
        else {
          var colorChoice = "#800000";
        }
    // }


    // For each location, create a marker and bind a popup with the location's name
    var quakeMarker = L.circle([location.geometry.coordinates[1], location.geometry.coordinates[0]], {
      fillOpacity: 0.7,
      color: colorChoice,
      fillColor: colorChoice,
      radius: parseInt(location.properties.mag)*80000
    })
      .bindPopup("<h3>Magnitude: " + location.properties.mag + "<hr>" + location.properties.place + "</h3>");

    // Add the marker to the quakeMarkers array
    quakeMarkers.push(quakeMarker);
  }

  // Create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(quakeMarkers));
}

// Perform an API call to the Citi Bike API to get location information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson", createMarkers);

