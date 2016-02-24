

function initialize() {

  var initialLocation;
  var loc, map, marker;
  var startPos;
  var browserSupportFlag =  new Boolean();
  var allinfo;
  var service, serviceB;


  loc = new google.maps.LatLng(-34.6033, -58.3817); //sets the map in Buenos Aires
  //creates the map
  map = new google.maps.Map(document.getElementById("map"), {
     zoom: 14,
     center: loc,
     mapTypeId: google.maps.MapTypeId.ROADMAP,
     //snazzy maps style
     styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]
  });




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

      keyword: 'burger'
    };

    service = new google.maps.places.PlacesService(map);
    service.radarSearch(request, callback);

    var request2 = {
      bounds: map.getBounds(),

      keyword: 'hamburgueseria'
    };

    //var service2 = new google.maps.places.PlacesService(map);
    service.radarSearch(request2, callback);

    $(".gm-style-cc").hide();
}



function callback(results, status) {
  console.log(results);
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

        var renderer = render_burguerInfo();

        renderer(result, function ($temp) {
          $('#burgerdata-custom').html($temp);
          openSidebar();
        });
      }); //closes service.getdetails
    });


  }

}

function render_burguerInfo() {
  var template;
  return function (content, cb) {
    if (template) {
      return cb(render(template, content));
    }

    $.get('/js/burguerinfo.template.html')
      .done(function (t) {
        template = t;
        cb(render(template, content));
      });
  }
}

function render (template, content) {
  var rendered = template;
  Object.keys(content).forEach(function (param) {
    rendered = rendered.replace('@@' + param + '@@', content[param]);
  });

  return $(rendered);
}

$(document).ready(function() {


$( "#cerrar" ).click(function() {
    closeSidebar();
    return false;
});

});

function openSidebar(){
    $("#sidebar").animate({left: "0"}, 200)
    return false;
}

function closeSidebar(){
    var ancho = $("#sidebar").height() * -1;
    $("#sidebar").animate({left: ancho}, 500)
    return false;
}
