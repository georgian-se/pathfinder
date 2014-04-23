(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var controllers=require('./controllers');

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
  // displayPage(controllers.main.home);
  displayPage(controllers.points.new_point);
};

var initMap=function(){
  var mapOptions = {
    zoom: defaultZoom,
    center: new google.maps.LatLng(defaultCenterLat,defaultCenterLng),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };
  map=new google.maps.Map(mapElement, mapOptions);
};

var displayPage=function(page_function,params){
  clearSidebar();
  var request={
    map:map,
    displayPage:displayPage,
    params:params,
  };
  sidebarElement.appendChild(page_function(request));
};

var clearSidebar=function(){
  var children=sidebarElement.children;
  for(var i=0,l=children.length;i<l;i++){
    sidebarElement.removeChild(children[i]);
  }
};
},{"./controllers":2}],2:[function(require,module,exports){
var main=require('./main_controller')
  , points=require('./points_controller')
  ;

exports.main=main;
exports.points=points;
},{"./main_controller":3,"./points_controller":4}],3:[function(require,module,exports){
var views=require('../views')
  , points=require('./points_controller')
  ;

exports.home=function(request){
  var model;
  var delegate={
    onNewPoint:function(){
      request.displayPage(points.new_point);
    },
  };
  var homeView=views.main.home(model,delegate);
  return homeView;
};

},{"../views":12,"./points_controller":4}],4:[function(require,module,exports){
var views=require('../views');

exports.new_point=function(request){
  var newPointView=views.points.new_point();
  var map=request.map;
  var marker;

  var showmarker=function(position){
    if(!marker){ marker=new google.maps.Marker({position:position,map:map}); }
    else{ marker.setPosition(position); }
  };

  map.setOptions({draggableCursor:'crosshair'});
  google.maps.event.addListener(map,'click',function(evt) {
    var position=evt.latLng;
    showmarker(position);
  });

  return newPointView;
};
},{"../views":12}],5:[function(require,module,exports){
var html=require('./html')
  , utils=require('./utils');

var btnClassNames=function(opts){
  var classNames;
  opts=opts || {};
  if(opts.type===false){ classNames=[]; }  
  else {
    opts.type=opts.type||'default';
    // var size=opts.size=='small'?'btn-xs':'btn-sm';
    // classNames=['btn','btn-'+opts.type,size];
    classNames=['btn','btn-xs','btn-'+opts.type]
  }
  return classNames;
};

exports.actionButton=function(text,action_f,opts){
  var el= html.el('a',{href:'#',class:btnClassNames(opts)},text);
  el.onclick=function(){
    if(action_f){ action_f(); }
    return false;
  }
  return el;
};

exports.actionLink=function(text,action_f,opts){
  opts=opts || {};
  opts.type=false; // disable button
  return this.actionButton(text,action_f,opts);
};

exports.buttonGroup=function(buttons){
  return html.el('div',{class:'btn-group'},buttons);
};

exports.toolbar=function(buttons){
  return html.el('div',{class:'btn-toolbar'},buttons);
};

exports.dropdown=function(text,buttons,opts){
  var classes=btnClassNames(opts).concat(['dropdown-toggle']);
  if(utils.isArray(text)){text=text.push(' ');} else{text=[text,' '];}
  text.push(html.el('span',{class:'caret'}));
  var btn=html.el('button',{class:classes,'data-toggle':'dropdown'},text);
  var dd=html.el('ul',{class:'dropdown-menu'},buttons.map(function(x){ return html.el('li',[x]); }));
  return html.el('div',{class:'btn-group'},[btn,dd]);
};
},{"./html":6,"./utils":10}],6:[function(require,module,exports){
var utils=require('./utils');

var dashedToCamelized=function(name){
  var firstToUpper=function(x){return [x.substring(0,1).toUpperCase(),x.substring(1)].join('');};
  var parts=name.split('-');
  return [parts[0]].concat(parts.slice(1).map(firstToUpper)).join('');
};

var applyAttribute=function(element,attrName,attrValue){
  if('class'===attrName){

    // class => className
    if(utils.isArray(attrValue)){ element.className=attrValue.join(' '); }
    else{ element.className=attrValue; }
  }
  else if('style'===attrName && attrValue){

    // styles

    var styles=attrValue.split(';');
    for(var i=0,l=styles.length;i<l;i++) {
      var styleInfo=styles[i];
      if(styleInfo && styleInfo.length>0){
        var colonIndex=styleInfo.indexOf(':');
        var styleName=dashedToCamelized(styleInfo.substring(0,colonIndex));
        var styleValue=styleInfo.substring(colonIndex+1);
        element.style[styleName]=styleValue;
      }
    }
  }
  else{ element.setAttribute(attrName,attrValue); }
};

var createElement=function(tag,attrs,children){
  var element = document.createElement(tag);
  if(attrs){ for(attrName in attrs){ applyAttribute(element,attrName,attrs[attrName]); } }
  if(children){
    for(var i=0,l=children.length;i<l;i++){
      var child=children[i];
      if(typeof child==='string'){ element.appendChild(document.createTextNode(child)); }
      else if(utils.isElement(child)){ element.appendChild(child); }
    }
  }
  return element;
};

/**
 * ```
 * el([parent],tag,[attributes],[children])
 * ```
 *
 * `parent`:Element parent for this element
 * `tag`:String tag name
 * `attributes`:Object tag attributes
 * `children`:{Element|Array|String}
 */
exports.el=function(){
  var parent,tag,attrs,children;
  var curr_index=0;

  // first argument may be a parent
  if(utils.isElement(arguments[curr_index])){ parent=arguments[curr_index]; curr_index+=1; }

  // argument[curr_index] is mandatory 
  tag=arguments[curr_index]; curr_index+=1;
  if(typeof tag !== 'string'){ throw "Tag not defined"; }

  // getting attributes
  if(!utils.isArray(arguments[curr_index]) && typeof arguments[curr_index]==='object'){ attrs=arguments[curr_index]; curr_index+=1; }

  // getting children
  if(typeof arguments[curr_index]==='string' || utils.isElement(arguments[curr_index])){
    children=[ arguments[curr_index] ]; curr_index+=1;
  } else if(utils.isArray(arguments[curr_index])){
    children=arguments[curr_index]; curr_index+=1;
  }

  // create element
  var element=createElement(tag,attrs,children);

  // if parent is given, then append this element to parent
  if (element && parent){ parent.appendChild(element); }

  return element;
};

exports.pageTitle=function(title,tag){
  return exports.el(tag||'h3',{class:'page-header'},title);
};

exports.p=function(text,opts){
  return exports.el('p',opts,text);
};
},{"./utils":10}],7:[function(require,module,exports){
var html=require('./html');

exports.faIcon=function(iconName){
  return html.el('i',{class:'fa fa-'+iconName});
};
},{"./html":6}],8:[function(require,module,exports){
var html=require('./html')
  , icon=require('./icon')
  , button=require('./button')
  , page=require('./page');

// standard html elements
exports.pageTitle=html.pageTitle

// icon
exports.faIcon=icon.faIcon;

// buttons
exports.actionButton=button.actionButton;
exports.actionLink=button.actionLink;
exports.buttonGroup=button.buttonGroup;
exports.dropdown=button.dropdown;
exports.toolbar=button.toolbar;

// page
exports.verticalLayout=page.verticalLayout;
},{"./button":5,"./html":6,"./icon":7,"./page":9}],9:[function(require,module,exports){
var html=require('./html')
  , utils=require('./utils');

exports.verticalLayout=function(parts,opts){
  var childOptions={};

  // padding options
  var padding=[0];
  if(opts&&opts.padding){
    if (typeof opts.padding){ padding=[opts.padding]; }
    else if(utils.isArray(opts.padding)){ padding=opts.padding; }
  }
  childOptions.style='padding:'+padding.map(function(x){ return x+'px'; }).join(' ')+';';
  childOptions.class='vertical-layout-child';

  // main layout element
  var layout=html.el('div',{class:'vertical-layout'});
  for(var i=0,l=parts.length;i<l;i++){ html.el(layout,'div',childOptions,parts[i]); }

  return layout;
};
},{"./html":6,"./utils":10}],10:[function(require,module,exports){
exports.isArray=function(x){ return x && (x instanceof Array); };
exports.isElement=function(x){ return x && ((x instanceof Element) || (x instanceof Document)); }
},{}],11:[function(require,module,exports){
require('./application')({
  //apikey:'AIzaSyBAjwtBAWhTjoGcDaas_vs7vmUKgensPbE',
});
},{"./application":1}],12:[function(require,module,exports){
var main=require('./main');
var points=require('./points');

exports.main=main;
exports.points=points;
},{"./main":14,"./points":15}],13:[function(require,module,exports){
var forma=require('../../forma');

var mModel
  , mDelegate
  ;

module.exports=function(model,delegate){
  mModel=model;
  mDelegate=delegate;

  initUI();

  return mLayout;
};

var mLayout
  , mTitle
  , mToolbar
  , mBtnNewPoint
  ;

var initUI=function(){
  mTitle=forma.pageTitle('საწყისი');

  mBtnNewPoint=forma.actionButton([forma.faIcon('plus'),' ახალი წერტილი'], mDelegate&&mDelegate.onNewPoint);
  mToolbar=forma.toolbar([mBtnNewPoint]);

  mLayout=forma.verticalLayout([mTitle,mToolbar]);
};
},{"../../forma":8}],14:[function(require,module,exports){
var home=require('./home');

exports.home=home;
},{"./home":13}],15:[function(require,module,exports){
var new_point=require('./new_point');

exports.new_point=new_point;
},{"./new_point":16}],16:[function(require,module,exports){
var forma=require('../../forma')
  , html=require('../../forma/html');

module.exports=function(model,delegate){
  initUI();
  return mLayout;
};

var mLayout
  , mTitle
  , mDescription
  ;

var initUI=function(){
  mTitle=forma.pageTitle('ახალი წერტილი');
  mDescription=html.p('ახალი წერტილის კოორდინატის მისაღებად დააწკაპეთ რუკაზე',{class:'text-muted'});
  mLayout=forma.verticalLayout([mTitle,mDescription]);
};

},{"../../forma":8,"../../forma/html":6}]},{},[11])