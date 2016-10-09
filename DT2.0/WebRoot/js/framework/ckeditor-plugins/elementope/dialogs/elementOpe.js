CKEDITOR.dialog.add( 'elementOpe', function( editor ) {
	var initDialog = function(dialog,index,isInit){
		var element = dialog.element = dialog.currElement.getParents(true)[index];
	    var style = element.getAttribute("style");
	    dialog.options = {eIndex:index,style:new StyleMap(style), id: element.getAttribute("id"), className: element.getAttribute("class"), title: element.getAttribute("title")};
	    dialog.setupContent( dialog.element, dialog.options, isInit);//调用setup函数赋值
	};
    return {
        title: '删除元素',
        minWidth: 150,
        minHeight: 60,
        contents: [
            {
                id: 'elementOpe',
                elements: [
					{
                        	  type: 'hbox',
                        	  widths: ["50%","50%"],
                        	  children: [
	            	                {
	            	       	    	  label: "删除的元素：",
	            	       	    	  title: '可删除的元素为当前焦点所在元素及其父辈元素！\n此列表依次为当前元素及其父辈元素。',
	            	       	    	  type: "select",
	            	       	    	  id: "eIndex",
	            	       	    	  items: [],
	            	       	          setup: function( element ) {
            	                		var els = element.getParents(true);
            	                		this.clear();
            	                		for(var i=0;i<els.length;i++){
            	                			if(/^(html|body)$/.test(els[i].getName())){
            	                				break;
            	                			}
            	                			this.add(els[i].getName(),i);
            	                		}
	            	                	this.setValue(0,true); //不触发onChange事件
	            	       	          },
	            	       	          onChange: function(evt){
	            	       	          }
	            	       	        },
		                       	    {
	                       	    	  type: "select",
	                       	    	  label: "是否删除子元素：",
	                       	    	  id: "isDelSub",
	                       	    	  items: [['是','1'],['否','0']],
	                       	    	  setup: function( element, opts ) {
	                       	    	  	this.setValue('1');
	                           	      }
		                       	    }
                        	  ]
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
            this.setupContent(dialog.currElement);
    	},
        onOk: function() {
            var dialog = this;
            var eIndex =  dialog.getValueOf( 'elementOpe', 'eIndex' );
            var isDelSub =  dialog.getValueOf( 'elementOpe', 'isDelSub' );
            var els = dialog.currElement.getParents(true);
            els[eIndex].remove(isDelSub=='1'?false:true);
        }
    };
});