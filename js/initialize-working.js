

function initialize() {
  var initialLocation;
  var loc, map, marker;
  var startPos;
  var browserSupportFlag =  new Boolean();
  var allinfo;


  loc = new google.maps.LatLng(-34.6033, -58.3817); //sets the map in Buenos Aires
  //creates the map
  map = new google.maps.Map(document.getElementById("map"), {
     zoom: 11,
     center: loc,
     mapTypeId: google.maps.MapTypeId.ROADMAP,
     //snazzy maps style
     styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]
  });

  var infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);

  //asks for the user position
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      map.setCenter(initialLocation);
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  }

  map.addListener('idle', performSearch);

  function performSearch() {
    var request = {
    bounds: map.getBounds(),
    keyword: 'hamburgueseria'
  };
    service.radarSearch(request, callback);
  }

  function callback(results, status) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
      console.error(status);
    return;
    }
    for (var i = 0, result; result = results[i]; i++) {
      addMarker(result);
    }
  }

  function addMarker(place) {
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: {
        url: 'https://s3.amazonaws.com/com.cartodb.users-assets.production/production/0xbunny/assets/20150929061600pinfinal.png',
        anchor: new google.maps.Point(10, 10),
        scaledSize: new google.maps.Size(24, 30)
      }

    });




    google.maps.event.addListener(marker, 'click', function(e) {

      service.getDetails(place, function(result, status) {

        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          console.error(status);
        return;
        }
          allinfo = result;
          var infoBox = new InfoBox({latlng: marker.getPosition(), map: map});

        google.maps.event.trigger(marker, "click");



      //////////////////////////////////////////////////////////////////


      }); //closes service.getdetails
    });


  }



    function InfoBox(opts) {

      google.maps.OverlayView.call(this);
      this.latlng_ = opts.latlng;
      this.map_ = opts.map;
      this.offsetVertical_ = -195;
      this.offsetHorizontal_ = 0;
      this.height_ = 165;
      this.width_ = 266;

      var me = this;
      this.boundsChangedListener_ =
        google.maps.event.addListener(this.map_, "bounds_changed", function() {
          return me.panMap.apply(me);
        });

      // Once the properties of this OverlayView are initialized, set its map so
      // that we can display it.  This will trigger calls to panes_changed and
      // draw.
      this.setMap(this.map_);
    }

    /* InfoBox extends GOverlay class from the Google Maps API
     */
    InfoBox.prototype = new google.maps.OverlayView();

    /* Creates the DIV representing this InfoBox
     */
    InfoBox.prototype.remove = function() {
      if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
      }
    };

    /* Redraw the Bar based on the current projection and zoom level
     */
    InfoBox.prototype.draw = function() {
      // Creates the element if it doesn't exist already.
      this.createElement();
      if (!this.div_) return;

      // Calculate the DIV coordinates of two opposite corners of our bounds to
      // get the size and position of our Bar
      var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
      if (!pixPosition) return;

      // Now position our DIV based on the DIV coordinates of our bounds
      this.div_.style.width = this.width_ + "px";
      this.div_.style.left = (pixPosition.x + this.offsetHorizontal_) + "px";
      this.div_.style.height = this.height_ + "px";
      this.div_.style.top = (pixPosition.y + this.offsetVertical_) + "px";
      this.div_.style.display = 'block';
    };

    /* Creates the DIV representing this InfoBox in the floatPane.  If the panes
     * object, retrieved by calling getPanes, is null, remove the element from the
     * DOM.  If the div exists, but its parent is not the floatPane, move the div
     * to the new pane.
     * Called from within draw.  Al
     ternatively, this can be called specifically on
     * a panes_changed event.
     */
    InfoBox.prototype.createElement = function() {
      var panes = this.getPanes();
      var sidebar = this.div_;
      if (!sidebar) {

        // This does not handle changing panes.  You can set the map to be null and
        // then reset the map to move the div.
        sidebar = this.div_ = document.createElement("div");

        sidebar.style.border = "0px none";
        sidebar.id = "sidebar";
        //sidebar.style.position = "absolute";
        //sidebar.style.background = "url('http://gmaps-samples.googlecode.com/svn/trunk/images/blueinfowindow.gif')";
        //sidebar.style.width = this.width_ + "px";
        //sidebar.style.height = this.height_ + "px";
        var contentDiv = document.createElement("div");
        //contentDiv.style.padding = "30px"
        contentDiv.innerHTML = allinfo.name + '<br> <br>' + allinfo.formatted_address + '</strong><br>' + allinfo.website  + '</strong><br>' + allinfo.rating + '</strong><br>' + allinfo.formatted_phone_number ;

        var topDiv = document.createElement("div");
        topDiv.style.textAlign = "right";
        var closeImg = document.createElement("img");
        closeImg.id ="cerrar";
        closeImg.style.width = "32px";
        closeImg.style.height = "32px";
        closeImg.style.cursor = "pointer";
        topDiv.appendChild(closeImg);

        function removeInfoBox(ib) {
          return function() {
            ib.setMap(null);
          };
        }

        //google.maps.event.addDomListener(closeImg, 'click', removeInfoBox(this));
        //google.maps.event.addDomListener(closeImg, 'click', infoBox.remove());


        sidebar.appendChild(topDiv);
        sidebar.appendChild(contentDiv);
        sidebar.style.display = 'none';
        panes.floatPane.appendChild(sidebar);
        this.panMap();
      } else if (sidebar.parentNode != panes.floatPane) {
        // The panes have changed.  Move the div.
        sidebar.parentNode.removeChild(sidebar);
        panes.floatPane.appendChild(sidebar);
      } else {
        // The panes have not changed, so no need to create or move the div.
      }
    }

    /* Pan the map to fit the InfoBox.
     */
    InfoBox.prototype.panMap = function() {
      // if we go beyond map, pan map
      var map = this.map_;
      var bounds = map.getBounds();
      if (!bounds) return;

      // The position of the infowindow
      var position = this.latlng_;

      // The dimension of the infowindow
      var iwWidth = this.width_;
      var iwHeight = this.height_;

      // The offset position of the infowindow
      var iwOffsetX = this.offsetHorizontal_;
      var iwOffsetY = this.offsetVertical_;

      // Padding on the infowindow
      var padX = 40;
      var padY = 40;

      // The degrees per pixel
      var mapDiv = map.getDiv();
      var mapWidth = mapDiv.offsetWidth;
      var mapHeight = mapDiv.offsetHeight;
      var boundsSpan = bounds.toSpan();
      var longSpan = boundsSpan.lng();
      var latSpan = boundsSpan.lat();
      var degPixelX = longSpan / mapWidth;
      var degPixelY = latSpan / mapHeight;

      // The bounds of the map
      var mapWestLng = bounds.getSouthWest().lng();
      var mapEastLng = bounds.getNorthEast().lng();
      var mapNorthLat = bounds.getNorthEast().lat();
      var mapSouthLat = bounds.getSouthWest().lat();

      // The bounds of the infowindow
      var iwWestLng = position.lng() + (iwOffsetX - padX) * degPixelX;
      var iwEastLng = position.lng() + (iwOffsetX + iwWidth + padX) * degPixelX;
      var iwNorthLat = position.lat() - (iwOffsetY - padY) * degPixelY;
      var iwSouthLat = position.lat() - (iwOffsetY + iwHeight + padY) * degPixelY;

      // calculate center shift
      var shiftLng =
          (iwWestLng < mapWestLng ? mapWestLng - iwWestLng : 0) +
          (iwEastLng > mapEastLng ? mapEastLng - iwEastLng : 0);
      var shiftLat =
          (iwNorthLat > mapNorthLat ? mapNorthLat - iwNorthLat : 0) +
          (iwSouthLat < mapSouthLat ? mapSouthLat - iwSouthLat : 0);

      // The center of the map
      var center = map.getCenter();

      // The new map center
      var centerX = center.lng() - shiftLng;
      var centerY = center.lat() - shiftLat;

      // center the map to the new shifted center
      map.setCenter(new google.maps.LatLng(centerY, centerX));

      // Remove the listener after panning is complete.
      google.maps.event.removeListener(this.boundsChangedListener_);
      this.boundsChangedListener_ = null;
    };

    google.maps.event.addDomListener(window, 'resize', function() {
    map.setCenter(center);
});

}
$(document).ready(function() {


function openSidebar(){
    $("#sidebar").animate({left: "0"}, 200)
    return false;
}

function closeSidebar(){
    var ancho = $("#sidebar").height() * -1;
    $("#sidebar").animate({left: ancho}, 500)
    return false;
}


$( "#cerrar" ).click(function() {
    closeSidebar();
    return false;
});

});
