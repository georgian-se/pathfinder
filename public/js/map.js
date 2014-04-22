(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

  //var link=forma.faIcon('heart');

  var b1=forma.actionButton([forma.faIcon('heart'),' Button1'], function(){ alert('Button1 clicked!'); }, {size:'small'});
  var b2=forma.actionButton(['Button2'], function(){ alert('Button2 clicked!'); }, {size:'small'});
  var groups=forma.dropdown([b1,b2]);

  sidebarElement.appendChild(groups);
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
},{"./forma":2}],2:[function(require,module,exports){
var html=require('./html');

var faIcon=function(iconName){
  return html.el('i',{class:'fa fa-'+iconName});
};

var actionButton=function(text,action_f,opts){
  opts=opts || {};
  var classNames;
  if(opts.type===false){ classNames=[]; }
  else {
    opts.type=opts.type||'default';
    var size=opts.size=='small'?'btn-xs':'btn-sm';
    classNames=['btn','btn-'+opts.type,size];
  }
  var el= html.el('a',{href:'#',class:classNames},text);
  el.onclick=function(){
    action_f();
    return false;
  }
  return el;
};

var actionLink=function(text,action_f,opts){
  opts=opts || {};
  opts.type=false; // disable button
  return actionButton(text,action_f,opts);
};

var buttonGroup=function(buttons){
  return html.el('div',{class:'btn-group'},buttons);
};

var dropdown=function(buttons){
  var dd=html.el('ul',{class:'dropdown-menu'});
  
  return dd;
};

// icon
exports.faIcon=faIcon;

// buttons
exports.actionButton=actionButton;
exports.actionLink=actionLink;
exports.buttonGroup=buttonGroup;
exports.dropdown=dropdown;
},{"./html":3}],3:[function(require,module,exports){
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
  else{ element[attrName]=attrValue; }
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
  if(typeof arguments[curr_index]==='object'){ attrs=arguments[curr_index]; curr_index+=1; }

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
},{"./utils":5}],4:[function(require,module,exports){
require('./application')({
  //apikey:'AIzaSyBAjwtBAWhTjoGcDaas_vs7vmUKgensPbE',
});
},{"./application":1}],5:[function(require,module,exports){
exports.isArray=function(x){ return x && (x instanceof Array); };
exports.isElement=function(x){ return x && ((x instanceof Element) || (x instanceof Document)); }
},{}]},{},[4])