exports.resetMap=function(map){
  google.maps.event.clearInstanceListeners(map);
  google.maps.event.clearInstanceListeners(map.data);
  map.data.revertStyle();
};

exports.copyFeatureToPath=function(feature,path){
  var g=feature.getGeometry();
  var ary=g.getArray();
  path.getPath().clear();
  for(var i=0,l=ary.length;i<l;i++){
    var p=ary[i];
    var point=new google.maps.LatLng(p.lat(),p.lng());
    path.getPath().push(point);
  }
};

// distances

exports.closestFeaturePoint=function(feature,point){
  var minDistance
    , minPoint
    ;
  var g=feature.getGeometry();
  var ary=g.getArray();
  for(var i=0,l=ary.length;i<l;i++){
    var p=ary[i];
    var x=new google.maps.LatLng(p.lat(),p.lng());
    var distance=google.maps.geometry.spherical.computeDistanceBetween(p,point);
    if(!minDistance || distance<minDistance){
      minDistance=distance;
      minPoint=p;
    }
  }
  return minPoint;
};

exports.calcFeatureDistance=function(map,feature){
  if(feature instanceof Array){
    var fullDistance=0;
    for(var p=0,q=feature.length;p<q;p++){
      fullDistance+=exports.calcFeatureDistance(map,feature[p]);
    }
    return fullDistance;
  }
  var g=feature.getGeometry()
    , dist=0
    , ary=g.getArray()
    , p0=ary[0]
    ;
  for(var i=0,l=ary.length;i<l;i++){
    var p=ary[i];
    dist+=google.maps.geometry.spherical.computeDistanceBetween(p0,p);
    p0=p;
  }
  return dist/1000;
};

// feature description

var typeName=function(type){
  if('Objects::Line'===type){ return 'გადამცემი ხაზი'; }
};

var lineDescription=function(map,f){
  var name=f.getProperty('name');
  return [
    '<p><strong>სახელი</strong>: ',name,'</p>',
    '<p><strong>გზის სიგრძე</strong>: <code>',exports.calcFeatureDistance(map,f).toFixed(3),'</code> კმ</p>'
  ].join('');
};

exports.featureDescription=function(map,f){
  var bodyDescription
    , type=f.getProperty('class')
    ;

  var texts=['<div class="panel panel-default">'];
  texts.push('<div class="panel-heading"><h4 style="margin:0;padding:0;">',typeName(type),'</h4></div>');
  if('Objects::Line'===type){ bodyDescription=lineDescription(map,f); }
  texts.push('<div class="panel-body">',bodyDescription,'</div>');
  texts.push('</div>');
  return texts.join('');
};
