var map, largeInfowindow, viewModel, bounds;

// Create a new blank array for all the listing markers.
var markers = [];

var ViewModel = function (){
    var self = this;
    self.locations = ko.observableArray([
      {
        name: 'Elante Mall',
        location: {
            lat: 30.7045698,
            lng: 76.796752
        },
        locId: "5114cd90e4b06bb0ed15a97f",
        list: true
      },
      {
          name: 'Sukhna Lake',
          location: {
              lat: 30.7420749,
              lng: 76.8127027
          },
          locId: "4c456c4b8c1f20a14ebd3d99",
          list: true
      },
      {
          name: 'Rose Garden',
          location: {
              lat: 30.7461143,
              lng: 76.7797887
          },
          locId: '4c0ba827009a0f47975cebbf',
          list: true
      },
      {
          name: 'JW Marriott Hotel',
          location: {
              lat: 30.726705,
              lng: 76.7649463
          },
          locId: "4dff0926d4c00c69c14b292a",
          list: true
      },
      {
          name: 'Rock Garden',
          location: {
              lat: 30.7524073,
              lng: 76.8050706
          },
          locId: "4b6fe660f964a5206dff2ce3",
          list: true
      },
      {
          name: 'Chandigarh Golf Club',
          location: {
              lat: 30.737874,
              lng: 76.8090905
          },
          locId: "4e97f82261af7d268f13d826",
          list: true
      },

      {
          name: 'Panjab University',
          location: {
              lat: 30.7600747,
              lng: 76.7641141
          },
          locId: "4c4ae6f0f7b49c74e81efdc1",
          list: true
      },

      {
          name: 'Barbeque Nation',
          location: {
              lat: 30.7260376,
              lng: 76.8053374
          },
          locId: "4bbf61eef353d13a29837e10",
          list: true
      }
    ]);
    // Places that should be visible, based on user input.
    self.filteredPlaces = ko.observableArray();
    // Create empty variable, which will give us the user's search
    self.query = ko.observable('');

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < self.locations().length; i++) {
      // Get the position from the location array.
      var position = self.locations()[i].location;
      var location = self.locations()[i].locId;
      var name = self.locations()[i].name;
      // Create a marker per location, and put into markers array.
      var marker = new google.maps.Marker({
      position: position,
      location: location,
      name: name,
      animation: google.maps.Animation.DROP,
      id: i
      });
      // Push the marker to our array of markers.
      markers.push(marker);
      // Create an onclick event to open an infowindow at each marker.
      marker.addListener('click', function() {
        self.populateInfoWindow(this, largeInfowindow);
      });
    }
      // Extend the boundaries of the map for each marker and display the marker
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
      }
      map.fitBounds(bounds);
      self.send_list = function(loc) {
      					for (var i = 0; i < markers.length; i++){
		                      if(markers[i].name === loc.name){
		                        self.populateInfoWindow(markers[i], largeInfowindow)
		                        }
		                     }
      					}

      // This function populates the infowindow when the marker is clicked. We'll only allow
      // one infowindow which will open at the marker that is clicked, and populate based
      // on that markers position.
      self.populateInfoWindow = function (marker, infowindow) {
          // Check to make sure the infowindow is not already opened on this marker.
          if (infowindow.marker != marker) {
            infowindow.setContent('<h6>Loading...</h6>');
            infowindow.marker = marker;
            var Url = 'https://api.foursquare.com/v2/venues/' + marker.location + 
            '?client_id=SSZA3RP2Y4SPNF5BSCB3QGW1T0GJRX0ASEPGCE1G0XZOWCCJ&client_secret=TXVHUYTIFOJSUVEVOR3QO0BKSUUPQWF1CA12E5EU41UDQZGQ&v=20170818&m=foursquare';
            $.getJSON(Url, function(data){
              var add, like, rate;
              articles = data.response.venue;
              add = articles.location.address || 'Address not available';
              like = articles.likes.count || 'Likes not available';
              rate = articles.rating || 'Ratings not available';
              infowindow.setContent('<h5>'+ marker.name+'</h5><br><h6>'+add+'</h6>'
                +'Likes : '+like+'<br>'+'Ratings : '+rate);
              }).fail(function(){
                infowindow.setContent('<h6>Failed to get information of your Location.</h6>');
              });
              infowindow.open(map, marker);
              marker.setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(function () { marker.setAnimation(null); }, 1400);
                // Make sure the marker property is cleared if the infowindow is closed.
                infowindow.addListener('closeclick', function() {
                  infowindow.marker = null;
                });
              }
        }

    // put them in the visible list
    self.locations().forEach(function (place) {
        self.filteredPlaces.push(place);
    });

    // Function to filter
    self.filter = function () {
        // First we remove everything from the visible list
        self.filteredPlaces.removeAll();
        // For each of the items in our locations array... 
      	markers.forEach(function (place) {
            // First we remove the marker
            place.setVisible(false);
            // Then we compare the name of the place in the array, with the name in our search
            if (place['name'].toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
				// If its the same, we push the place in the visible array (which we cleared)
                self.filteredPlaces.push(place);
            }
        });
        // Now we have the list of all the visible places, based on our query search
        self.filteredPlaces().forEach(function (place) {
            // And we put the markers visible for these places
            place.setVisible(true);
        });
    }
};

function initMap(){
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 30.7306308, lng: 76.7781669},
      zoom: 13
    });
    largeInfowindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();
    viewModel = new ViewModel();
    ko.applyBindings(viewModel);
}
 
function error() {
  var $data = $('#map');
  $data.append("<center><h1>Failed to initialize Google Maps.</h1><br></center>");
  $data.append("<center><h4>Please check your <b>GoogleAPI URL, </b><br><b>API Key</b> or other <b>credentials</b>.</h4></center>");
}

      
      