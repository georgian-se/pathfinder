var forma=require('./forma')
  , start=require('./views/start');

var mapElement;
var sidebarElement;

// google map object and it's parameters
var apikey;
var defaultCenterLat;
var defaultCenterLng;
var defaultZoom;
var map;

module.exports=function(opts){
  // sidebar element
  sidebarElement=document.getElementById(opts.sidebarid||'sidebar');

  // map element and default map data
  mapElement=document.getElementById(opts.mapid||'map');
  defaultCenterLat=opts.centerLat||41.693328079546774;
  defaultCenterLng=opts.centerLat||44.801473617553710;
  defaultZoom=opts.startZoom||10;

  // start loading map
  window.onload=loadingGoogleMapsAsyncronously;
};

var loadingGoogleMapsAsyncronously=function(){
  // loading google maps API v3
  var host='https://maps.googleapis.com/maps/api/js';
  var script = document.createElement('script');
  script.type = 'text/javascript';
  if (apikey){ script.src = host+'?v=3.ex&key='+apikey+'&sensor=false&callback=onGoogleMapLoaded'; }
  else{ script.src = host+'?v=3.ex&sensor=false&callback=onGoogleMapLoaded'; }
  document.body.appendChild(script);
  // register callback
  window.onGoogleMapLoaded=onGoogleMapLoaded;
};

var onGoogleMapLoaded=function(){
  initMap();
  initPagesController();
};

var initMap=function(){
  var mapOptions = {
    zoom: defaultZoom,
    center: new google.maps.LatLng(defaultCenterLat,defaultCenterLng),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };
  map=new google.maps.Map(mapElement, mapOptions);
};

var initPagesController=function(){
  // map.setOptions({ draggableCursor: 'crosshair' });
  displayPage(start());
};

var displayPage=function(page){
  clearSidebar();
  sidebarElement.appendChild(page);
};

var clearSidebar=function(){
  var children=sidebarElement.children;
  for(var i=0,l=children.length;i<l;i++){
    children.removeChild(children[i]);
  }
};