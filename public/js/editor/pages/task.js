var ui=require('../ui')
  , forms=require('./forms')
  , api=require('../api')
  , geo=require('./geo')
  ;

var self, canEdit
  , map, marker
  , layout, formLayout, uiInitialized = false
  , titleElement = ui.html.pageTitle('ახალი დავალება')
  ;

module.exports=function(){
  return {
    onEnter: function(){
      self=this ; map=self.map ;
      if (!uiInitialized) { initUI(self); }
      return layout;
    },
  };
};

var initUI=function(){
  var saveAction=function(){
    form.clearErrors();

    var model=form.getModel();

    if (self.params.paths) {
      model.paths = self.params.paths.map(function(x) {
        return x.getPath().getArray().map(function(x) {
          return {lat: x.lat(), lng: x.lng()};
        });
      });
    }

    if (self.params.destinations) {
      model.destinations = self.params.destinations.map(function(x) {
        return {id: x.getId(), type: geo.getType(x)};
      });
    }

    var callback=function(err,data){
      if(err){
        console.log(err);
      } else {
        if (data.number) {
          alert("დავალება გაგზავნილია: #" + data.number);
          self.openPage('root');
        } else {
          console.log(data);
        }
      }
    };

    var sent=api.task.save(model, callback);
    if(!sent){ form.setModel(model); }
  };

  var cancelAction=function(){
    self.openPage('root');
  };

  var form = forms.task.form({ save_action:saveAction, cancel_action:cancelAction });

  layout=ui.layout.vertical({children: [titleElement, form] });
  uiInitialized=true;
};
