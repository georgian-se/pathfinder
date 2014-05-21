var ui=require('./ui')
  , api=require('./api')
  , router=require('./router')
  , pages=require('./pages')
  ;

var mapElement, sidebarElement, toolbarElement
  , defaultCenterLat, defaultCenterLng, defaultZoom
  , apikey, map
  , app
  ;

/**
 * Entry point for the application.
 */
exports.start=function(opts){
  sidebarElement=document.getElementById((opts&&opts.sidebarid)||'sidebar');
  toolbarElement=document.getElementById((opts&&opts.toolbarid)||'toolbar');
  mapElement=document.getElementById((opts&&opts.mapid)||'map');
  defaultCenterLat=(opts&&opts.centerLat)||42.3;
  defaultCenterLng=(opts&&opts.centerLat)||43.8;
  defaultZoom=(opts&&opts.startZoom)||7;
  window.onload=loadingGoogleMapsAsyncronously;
};

var loadingGoogleMapsAsyncronously=function(){
  var host='https://maps.googleapis.com/maps/api/js';
  var script = document.createElement('script');
  script.type = 'text/javascript';
  var baseUrl=host+'?v=3.ex&sensor=false&callback=onGoogleMapLoaded&libraries=geometry';
  if (apikey){ script.src = baseUrl+'&key='+apikey; }
  else{ script.src = baseUrl; }
  document.body.appendChild(script);
  window.onGoogleMapLoaded=onGoogleMapLoaded;
};

var onGoogleMapLoaded=function(){
  initMap();
  initRouter();
};

var initMap=function(){
  var mapOptions = {
    zoom: defaultZoom,
    center: new google.maps.LatLng(defaultCenterLat,defaultCenterLng),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map=new google.maps.Map(mapElement, mapOptions);

  map.loadData=function(id){
    var url='/api/objects/all.json';
    map.data.loadGeoJson(url);
  };

  map.data.setStyle(function(f) {
    var className=f.getProperty('class');
    var name=f.getProperty('name');
    if ('Objects::Line'==className){
      var strokeColor, strokeWeight;
      if(f.selected){ strokeColor='#00AA00'; strokeWeight=5; }
      else if(f.hovered){ strokeColor='#00FF00'; strokeWeight=10; }
      else{ strokeColor='#FF0000'; strokeWeight=1; }
      return {
        strokeColor: strokeColor,
        strokeWeight: strokeWeight,
        strokeOpacity: 0.5,
        title: name,
      };
    } else if ('Objects::Tower'==className){
      return {
        icon: '/map/small_red.png',
        visible: true,
        clickable: true,
        title: name,
      };
    }
  });

  map.loadData();

  window.map=map;
};

// router

var initRouter=function(){
  // create application
  app=router.initApplication({map:map,toolbar:toolbarElement,sidebar:sidebarElement});

  // adding pages to the application
  app.addPage('root', pages.home());
  app.addPage('new_path', pages.new_path());
  app.addPage('edit_path', pages.edit_path());

  // start with root page
  app.openPage('root');
};