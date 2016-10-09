CKEDITOR.dialog.add( 'elementInsert', function( editor ) {
	var initDialog = function(dialog,index,isInit){
		var element = dialog.element = dialog.currElement.getParents(true)[index];
	    var style = element.getAttribute("style");
	    dialog.options = {eIndex:index,style:new StyleMap(style), id: element.getAttribute("id"), className: element.getAttribute("class"), title: element.getAttribute("title")};
	    dialog.setupContent( dialog.element, dialog.options, isInit);//调用setup函数赋值
	};
    return {
        title: '插入元素',
        minWidth: 60,
        minHeight: 60,
        contents: [
            {
                id: 'elementInsert',
                elements: [
	                {
	       	    	  label: "元素：",
	       	    	  title: '请选择要在当前焦点处插入的元素',
	       	    	  type: "select",
	       	    	  id: "insertElement",
	       	    	  items: [
	       	    	      ['div','div'],['span','span'],['p','p']
	       	    	  ],
	       	          setup: function() {
	                	this.setValue(this.items[0][1],true); //不触发onChange事件
	       	          },
	       	          onChange: function(evt){
	       	          }
	       	        }
                ]
            }
        ],
        onLoad: function(){
    	},
        onShow: function(){
    	 	var dialog = this;
            var selection = editor.getSelection();
            var currElement = selection.getStartElement();
            dialog.currElement = currElement;
            this.setupContent();
    	},
        onOk: function() {
            var dialog = this;
            var elStr =  dialog.getValueOf( 'elementInsert', 'insertElement' );
            var newElement = dialog.currElement.getDocument().createElement(elStr);
            //newElement.setHtml("&nbsp;");
            editor.insertElement(newElement);
            setTimeout(function(){
            	var b=editor.createRange();
            		b.moveToPosition(newElement,CKEDITOR.POSITION_AFTER_START);
            		b.select()
            	},10);
        }
    };
});