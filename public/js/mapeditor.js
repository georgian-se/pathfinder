(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BASE_PATH='/api/geo';

var pointsFromPath=function(path){
  var points=[];
  path.forEach(function(element,index){
    points.push({
      id:element.id,
      lat:element.lat(),
      lng:element.lng(),
      featureId:element.featureId
    });
  });
  return points;
};

exports.newPath=function(path,callback){
  if(path.getLength()>1){
    var points=pointsFromPath(path);
    $.post(BASE_PATH+'/new_path',{points:points},function(data){
      if(callback){ callback(data); }
    }).fail(function(err){
      if(callback){ callback(err); }
    });
    return true;
  }
  return false;
};

exports.editPath=function(id,path,callback){
  if(path.getLength()>1){
    var points=pointsFromPath(path);
    $.post(BASE_PATH+'/edit_path',{id:id,points:points},function(data){
      if(callback){ callback(data); }
    }).fail(function(err){
      if(callback){ callback(err); }
    });
    return true;
  }
  return false;
};

exports.deletePath=function(id,callback){
  $.post(BASE_PATH+'/delete_path',{id:id},function(data){
    if(callback){ callback(data); }
  }).fail(function(err){
    if(callback){ callback(err); }
  });;
  return true;
};
},{}],2:[function(require,module,exports){
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
  defaultCenterLat=(opts&&opts.centerLat)||41.693328079546774;
  defaultCenterLng=(opts&&opts.centerLat)||44.801473617553710;
  defaultZoom=(opts&&opts.startZoom)||10;
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
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };
  map=new google.maps.Map(mapElement, mapOptions);
  loadMapData(map);
};

var loadMapData=function(map,id){
  var url=id? '/geo/map.json?id='+id:'/geo/map.json'
  map.data.loadGeoJson(url);
  map.data.setStyle({
    strokeColor:'red',
    strokeWeight:1,
    strokeOpacity:0.5,
  });
};

// router

var initRouter=function(){
  // create application
  app=router.initApplication({map:map,toolbar:toolbarElement,sidebar:sidebarElement});

  // adding pages to the application
  app.addPage('root', pages.home());
  app.addPage('new_path', pages.new_path());

  // start with root page
  app.openPage('root');
};
},{"./api":1,"./pages":5,"./router":7,"./ui":10}],3:[function(require,module,exports){
var app=require('./app');

app.start();
},{"./app":2}],4:[function(require,module,exports){
var ui=require('../ui')
  ;

var layout
  , uiInitialized=false
  , titleElement=ui.html.pageTitle('საწყისი')
  , toolbar=ui.button.toolbar([])
  ;

module.exports=function(){
  return {
    onEnter: function(){
      var self=this;

      if (!uiInitialized){
        initUI(self);
      }

      return layout;
    },
  };
};

var initUI=function(self){
  var btnNewPath=ui.button.actionButton('ახალი გზა', function(){
    self.openPage('new_path');
  }, {icon:'plus'});

  toolbar.addButton(btnNewPath);

  layout=ui.layout.vertical({
    children: [
      titleElement,
      toolbar,
    ]
  });

  uiInitialized=true;
};
},{"../ui":10}],5:[function(require,module,exports){
var home=require('./home')
  , new_path=require('./new_path')
  ;

exports.home=home;
exports.new_path=new_path;
},{"./home":4,"./new_path":6}],6:[function(require,module,exports){
var ui=require('../ui')
  ;

var layout
  , uiInitialized=false
  , titleElement=ui.html.pageTitle('ახალი გზის დამატება')
  , toolbar=ui.button.toolbar([])
  , desriptionElement=ui.html.p('ახალი გზის გასავლებად გამოიყენეთ თქვენი მაუსი. რედაქტირების დასრულების შემდეგ დააჭირეთ შენახვის ღილაკს.',{style:'margin-top:8px;'})
  ;

module.exports=function(){
  return {
    onEnter: function(){
      var self=this;

      if(!uiInitialized){ initUI(self); }

      return layout;
    },
  };
};

var initUI=function(self){
  var btnBack=ui.button.actionButton('უკან', function(){
    self.openPage('root');
  }, {icon:'arrow-left'});

  toolbar.addButton(btnBack);

  layout=ui.layout.vertical({
    children: [
      titleElement,
      toolbar,
      desriptionElement,
    ]
  });

  uiInitialized=true;
};
},{"../ui":10}],7:[function(require,module,exports){
var map
  , sidebar
  , toolbar
  , currentPage
  , pages={}
  ;

exports.initApplication=function(opts){
  map=opts.map;
  toolbar=opts.toolbar;
  sidebar=opts.sidebar;
  return {
    addPage: addPage,
    openPage: openPage,
  };
};

var addPage=function(name,page){
  page.openPage=openPage;
  pages[name]=page;
};

var openPage=function(name,params){
  // exiting currently open page
  if(currentPage){
    if(currentPage.onPause){
      var resp=currentPage.onPause();
      if(resp===false){ return; }
    }
    if(currentPage.onExit){
      currentPage.onExit();
    }
  }

  // clear sidebar
  sidebar.innerText='';

  // opening new page
  currentPage=pages[name];
  if(currentPage){
    currentPage.params=params;
    if(currentPage.onEnter){
      var pageLayout=currentPage.onEnter();
      sidebar.appendChild(pageLayout);
    }
    if(currentPage.onStart){
      currentPage.onStart();
    }
  }
};

},{}],8:[function(require,module,exports){
var html=require('./html')
  , utils=require('./utils')
  ;

var btnClassNames=function(opts){
  var classNames;
  opts=opts || {};
  if(opts.type===false){
    classNames=[]; // plain link!
  } else {
    opts.type=opts.type||'default';
    classNames=['btn','btn-sm','btn-'+opts.type]
  }
  return classNames;
};

var ensureClassName=function(el,className,classNamePresent){
  var currentClassNames=el.className.split(' ').filter(function(x){return x!=className;});
  if(classNamePresent){ currentClassNames.push(className); }
  el.className=currentClassNames.join(' ');
};

exports.actionButton=function(text,action_f,opts){
  var children = utils.isArray(text) ? text : [text];

  if(opts.icon){
    var icon=html.el('i',{class:'fa fa-'+opts.icon});
    children=[icon,' '].concat(children);
  }

  var el= html.el('a',{href:'#',class:btnClassNames(opts)},children);
  var enabled=opts&&opts.enabled;
  if(enabled!==false&&enabled!==true){ enabled=true; }
  el.onclick=function(){
    if(action_f && enabled){ action_f(); }
    return false;
  }
  el.setEnabled=function(val){ enabled=val;ensureClassName(el,'disabled',!enabled); };
  el.setWaiting=function(val){ el.setEnabled(!val);ensureClassName(el,'waiting',!enabled); };

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
  var toolbar=html.el('div',{class:'btn-toolbar'},buttons)
  toolbar.addButton=function(button){
    toolbar.appendChild(button);
  };
  return toolbar;
};

exports.dropdown=function(text,buttons,opts){
  var classes=btnClassNames(opts).concat(['dropdown-toggle']);
  if(utils.isArray(text)){text=text.push(' ');} else{text=[text,' '];}
  text.push(html.el('span',{class:'caret'}));
  var btn=html.el('button',{class:classes,'data-toggle':'dropdown'},text);
  var dd=html.el('ul',{class:'dropdown-menu'},buttons.map(function(x){ return html.el('li',[x]); }));
  return html.el('div',{class:'btn-group'},[btn,dd]);
};
},{"./html":9,"./utils":12}],9:[function(require,module,exports){
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
  return exports.el('p',opts||{},text);
};
},{"./utils":12}],10:[function(require,module,exports){
var button=require('./button')
  , layout=require('./layout')
  , html=require('./html')
  ;

exports.html=html;
exports.button=button;
exports.layout=layout;

},{"./button":8,"./html":9,"./layout":11}],11:[function(require,module,exports){
var html=require('./html')
 ;

/**
 * Vertical layout.
 */
exports.vertical=function(opts){
  var layout
    , childElements=[]
    ;

  if(opts.parent){ layout=html.el(opts.parent,'div',{class:'vertical-layout'}); }
  else { layout=html.el('div',{class:'vertical-layout'}); }

  var addToLayout=function(child){
    var childElement=html.el(layout,'div',[child]);
    childElements.push(childElement);
  };

  if(opts.children){
    var children=opts.children;
    for(var i=0, l=children.length; i<l; i++){
      addToLayout(children[i]);
    }
  }

  layout.add=addToLayout;

  return layout;
};

},{"./html":9}],12:[function(require,module,exports){
exports.isArray=function(x){ return x && (x instanceof Array); };
exports.isElement=function(x){ return x && ((x instanceof Element) || (x instanceof Document)); }
exports.fieldValue=function(object,name){ return object&&object[name]; };
},{}]},{},[3])