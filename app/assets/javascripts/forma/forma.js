(function(container) {
  // utils

  var _lastId=0;
  var nextId=function(){ _lastId++ ; return 'frm-'+_lastId; };

  var htmlescape=function(value){
    if (value) {
      return ('' + value)
        .replace('"','&quot;')
        .replace('>','&gt;')
        .replace('<','&lt;');
    } else {return value;}
  };

  var htmlAttribute=function(name,value){ return [name,'=','"',value,'"'].join(''); };

  // generation

  var generateLabelHTML=function(field){
    var labelHTML='';
    var id=field['id'];
    var label=field['label'];
    var required=field['required']
    if (label) {
      labelHTML=['<label ', id ? htmlAttribute("for",id) : '', '>',label,'</label>'].join('');
    }
    return labelHTML;
  };

  var generateInputHTML=function(options){
    var idAttr=htmlAttribute('id',options['id']);
    var nameAttr=htmlAttribute('name',options['name'] || id);
    var typeAttr=htmlAttribute('type',options['type'] || 'text');
    var classAttr=htmlAttribute('class','forma-control');
    var valueAttr='';
    var value=options['value'];
    if(value){
      valueAttr=htmlAttribute('value',htmlescape(value));
    }
    var attributes=[idAttr,nameAttr,classAttr,typeAttr,valueAttr].join(' ');
    return ['<input ',attributes,' />'].join('');
  };

  var generateFieldHTML=function(field){
    var labelHTML=generateLabelHTML(field);
    var editorHTML=field.editorHTML();
    var classes=['forma-group',field.required?'required':'optional'].join(' ');
    var classAttrs=htmlAttribute('class',classes);
    return ['<div ',classAttrs,'>',labelHTML,editorHTML,'</div>'].join('');
  };

  // 

  var textField=function(options){
    if (!options) { options={}; }
    var id=options['id'] || nextId();
    var name=options['name'];
    var label=options['label'] || name;
    var required=options['required'];
    return {
      id:id,
      label:label,
      name:name,
      required:required,
      value:null,
      setModel:function(model) {
        this.model=model;
        this.setValue(model[this.name]);
      },
      setValue:function(value) {
        this.value=value;
        this.resetField();
      },
      getValue:function(){
        var htmlElement=document.getElementById(this.id);
        if (htmlElement) { this.value=htmlElement.value; }
        return this.value;
      },
      resetField:function() {
        var htmlElement=document.getElementById(this.id);
        if (htmlElement) {
          htmlElement.value=this.value;
        }
      },
      editorHTML:function(){
        return generateInputHTML({id:this.id,name:this.name,value:this.value});
      },
      toHTML:function() {
        return generateFieldHTML(this);
      },
    };
  };

  var form=function(opts){
    var id=nextId();
    var titleHTML=(function(title,icon){
          var titleHTML='';
          if (title) {
            // TODO
          } 
          return titleHTML;
        })(opts['title'],opts['icon']);
    return {
      id:id,
      toHTML:function(){
        // TODO
      },
    };
  };

  // PUBLIC API

  container.Forma = {
    textField: textField // (name,options)
  };
})(window);
