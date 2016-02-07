/*
 *  Inicializacion del mapa
 *  Google Analytics
 *
 *  @version: 0.1
 *  @author: Yohanna Etchemendy, Nicolás Lound
 *
 *
 */

'use strict'

// Instancio el mapa
cartodb.createVis('mapa', 'https://0xbunny.cartodb.com/api/v2/viz/14e5e5d8-2fcc-11e5-b510-0e0c41326911/viz.json')
  .done(function(vis, layers) {
    layers[1].setInteraction(true);
    layers[1].on('featureClick', function(e, latlng, pos, data) {
        openJoint(data)
    });
  });

function openJoint(data){
    openSidebar();
    //$("#picture").html("foto");
    $("#name").html(data.nombre);
    $("#type").html(data.tipo);
    $("#addr").html(data.direccion);
    $("#phon").html(data.telefono);
    $("#web").html("<a href='"+data.web+"' target='_blank'>página web</a>");
    return false;
}

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


// Google Analytics
(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-65625200-1', 'auto');
ga('send', 'pageview');
