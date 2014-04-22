var forma=require('./forma');

var mapElement;
var sidebarElement;

// google map object and it's parameters
var apikey;
var defaultCenterLat;
var defaultCenterLng;
var defaultZoom;
var map;

var initializeGoogleMap=function(){
  var mapOptions = {
    zoom: defaultZoom,
    center: new google.maps.LatLng(defaultCenterLat,defaultCenterLng),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };
  map=new google.maps.Map(mapElement, mapOptions);

// TODO: remove code below

  var b1=forma.actionLink([forma.faIcon('heart'),' Button1'], function(){ alert('Button1 clicked!'); });
  var b2=forma.actionLink(['Button2'], function(){ alert('Button2 clicked!'); });
  var m1=forma.dropdown(forma.faIcon('plus'),[b1,b2], {size:'small'});
  //var group=forma.buttonGroup(m1);

  sidebarElement.appendChild(m1);
};

var loadGoogleMapsAsyncronously=function(){
  // loading google maps API v3
  var host='https://maps.googleapis.com/maps/api/js';
  var script = document.createElement('script');
  script.type = 'text/javascript';
  if (apikey){ script.src = host+'?v=3.ex&key='+apikey+'&sensor=false&callback=initializeGoogleMap'; }
  else{ script.src = host+'?v=3.ex&sensor=false&callback=initializeGoogleMap'; }
  document.body.appendChild(script);
  // register callback
  window.initializeGoogleMap=initializeGoogleMap;
};

var onDocumentLoaded=loadGoogleMapsAsyncronously;

module.exports=function(opts){
  // sidebar element
  sidebarElement=document.getElementById(opts.sidebarid||'sidebar');

  // map element and default map data
  mapElement=document.getElementById(opts.mapid||'map');
  defaultCenterLat=opts.centerLat||41.693328079546774;
  defaultCenterLng=opts.centerLat||44.801473617553710;
  defaultZoom=opts.startZoom||10;

  window.onload = onDocumentLoaded;
};