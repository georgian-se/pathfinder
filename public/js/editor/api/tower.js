var utils=require('./utils')
  ;

var BASE_PATH='/api/towers';

var save=function(id,model,callback){
  utils.clearErrors(model);

  var name=model.name
    , region_id=model.region_id
    ;

  if(!region_id){
    utils.addError(model,'region_id','აარჩიეთ რეგიონი');
    return false;
  }

  var params={id:id, name:name, region_id:region_id};
  var url=BASE_PATH+(id ? '/edit' : '/new');
  $.post(url, params, function(data){
    if(callback){ callback(null,data); }
  }).fail(function(err){
    if(callback){ callback(err,null); }
  });

  return true;
};

exports.newTower=function(model,callback){ return save(null,model,callback); };
exports.editTower=function(id,model,callback){ return save(id,model,callback); };

exports.deleteTower=function(id,callback){
  $.post(BASE_PATH+'/delete',{id:id},function(data){
    if(callback){ callback(null,data); }
  }).fail(function(err){
    if(callback){ callback(err,null); }
  });
  return true;
};