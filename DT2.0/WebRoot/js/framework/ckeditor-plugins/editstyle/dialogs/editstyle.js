CKEDITOR.dialog.add( 'editStyle', function( editor ) {
	var trim = function(str){
		return str?(str+'').replace(/^\s+|\s+$/g, ''):'';
	};
	var StyleMap = function(style){
		var _stArr =[];
		var _style ={};
		this.parseStyle = function(style){
			_style = {};
			_stArr = [];
		    if(style){
		    	var _arr = style.split(";")
		    	for(var i=0;i<_arr.length;i++){
		    		var _item = _arr[i];
		    		if(_item){
		    			var _itemArr = _item.split(":");
		    			if(_itemArr.length==2){
		    				var _name = trim(_itemArr[0]);
		    				var _value = trim(_itemArr[1]);
		    				if(_name&&_value){
		    					_style[_name] = _value;
		    					_stArr.push(_name);
		    				}
		    			}
		    			
		    		}
		    	}
		    }
		};
		var getIndex = function(name){
			for(var i=0;i<_stArr.length;i++){
				if(name==_stArr[i]){
					return i;
				}
			}
			return -1;
		};
		this.put = function(name,value){
			if(getIndex(name)==-1){
				_stArr.push(name);
				_style[name] = value;
			}else{
				_style[name] = value;
			}
		};
		this.get = function(name){
			return _style[name]||'';
		};
		this.remove = function(name){
			var index = -1;
			if((index=getIndex(name))!=-1){
				delete _style[name];
				_stArr.splice(index,1);
			}
		};
		this.styleString = function(){
			var styleStr = "";
			for(var i=0;i<_stArr.length;i++){
				if(_stArr[i]&&_style[_stArr[i]]){
					styleStr += (_stArr[i]+":"+_style[_stArr[i]]+";");
				}
			}
			return styleStr;
		};
		if(style){
			this.parseStyle(style);
		}
	};
	var initDialog = function(dialog,index,isInit){
		var element = dialog.element = dialog.currElement.getParents(true)[index];
	    var style = element.getAttribute("style");
	    dialog.options = {eIndex:index,style:new StyleMap(style), id: element.getAttribute("id"), className: element.getAttribute("class"), title: element.getAttribute("title")};
	    dialog.setupContent( dialog.element, dialog.options, isInit);//调用setup函数赋值
	};
	var formatUnit = function(value){
		if(/^(\+|-)?(\d)+(\.\d*)?$/.test(value)){
			return value + 'px';
		}
		return value;
	};
    return {
        title: '样式编辑',
        minWidth: 400,
        minHeight: 200,
        contents: [
            {
                id: 'tab-basic',
                label: '基本样式',
                elements: [                          
                    {
                        type: 'vbox',
                        padding: 3,
                        children:[
                          {
                        	  type: 'hbox',
                        	  widths: ["50%","50%"],
                        	  children: [
	            	                {
	            	       	    	  label: "编辑的元素：",
	            	       	    	  title: '可编辑的元素为当前焦点所在元素及其父辈元素！\n此列表依次为当前元素及其父辈元素。',
	            	       	    	  type: "select",
	            	       	    	  id: "eIndex",
	            	       	    	  items: [],
	            	       	          setup: function( element, opts, isInit ) {
	            	                	if(isInit){
	            	                		var els = element.getParents(true);
	            	                		this.clear();
	            	                		for(var i=0;i<els.length;i++){
	            	                			if(/^(html|body)$/.test(els[i].getName())){
	            	                				break;
	            	                			}
	            	                			this.add(els[i].getName(),i);
	            	                		}
	            	                	}
	            	                	this.setValue(opts.eIndex,true); //不触发onChange事件
	            	       	          },
	            	       	          onChange: function(evt){
	            	       	        	  var dialog = this.getDialog();
	            	       	        	  initDialog(dialog,evt.data.value);
	            	       	          }
	            	       	        },
		                       	    {
	                       	    	  type: "select",
	                       	    	  label: "文本对齐方式：",
	                       	    	  id: "textAlign",
	                       	    	  items: [['没有设置',''],['左对齐','left'],['居中','center'],['右对齐','right']],
	                       	    	  setup: function( element, opts ) {
	                       	    	  	this.setValue(opts.style.get('text-align'));
	                           	      }
		                       	    }
                        	  ]
                          },
                           {
                        	   type: 'hbox',
                        	   widths: ["50%","50%"],
                        	   children: [
                        	      {
                        	    	  type: "text",
                        	    	  label: "宽度：",
                        	    	  id: "width",
                        	          setup: function( element, opts ) {
                        	    	  	this.setValue(opts.style.get('width'));
                        	          },
                              	      title: '输入一个表示像素值的数字，或加上一个有效的 CSS 长度单位(px, %, in, cm, mm, em, ex, pt 或 pc)。'
                        	      },
                        	      {
                        	    	  type: "text",
                        	    	  label: "高度：",
                        	    	  id: "height",
                        	          setup: function( element, opts ) {
                        	    	  	this.setValue(opts.style.get('height'));
                          	          },
                              	      title: '输入一个表示像素值的数字，或加上一个有效的 CSS 长度单位(px, %, in, cm, mm, em, ex, pt 或 pc)。'
                        	      }
                        	   ]
                           }
                        ]
                    },
                    {
                        type: 'vbox',
                        padding: 3,
                        children:[
                           {
                        	   type: 'hbox',
                        	   widths: ["50%","50%"],
                        	   children: [
                        	      {
                        	    	  type: "text",
                        	    	  label: "内边距：",
                        	    	  id: "padding",
                            	      setup: function( element, opts ) {
                        	    	  	this.setValue(opts.style.get('padding'));
                          	          },
                              	      title: '输入一个表示像素值的数字，或加上一个有效的 CSS 长度单位(px, %, in, cm, mm, em, ex, pt 或 pc)。'
                        	      },
                        	      {
                        	    	  type: "text",
                        	    	  label: "外边距：",
                        	    	  id: "margin",
                            	      setup: function( element, opts ) {
                          	    	  	this.setValue(opts.style.get('margin'));
                            	      },
                              	      title: '输入一个表示像素值的数字，或加上一个有效的 CSS 长度单位(px, %, in, cm, mm, em, ex, pt 或 pc)。'
                        	      }
                        	   ]
                           }
                        ]
                    },
                    {
                        type: 'vbox',
                        padding: 3,
                        children:[
                           {
                        	   type: 'hbox',
                        	   widths: ["50%","50%"],
                        	   children: [
                        	      {
                        	    	  type: "text",
                        	    	  label: "边框宽度：",
                        	    	  id: "border",
                        	    	  setup: function( element, opts ) {
                          	    	  	this.setValue(opts.style.get('border').split(' ')[0]);
                              	      },
                              	      title: '输入一个表示像素值的数字，或加上一个有效的 CSS 长度单位(px, %, in, cm, mm, em, ex, pt 或 pc)。'
                        	      },
                           	      {
                           	    	  type: "text",
                           	    	  label: "提示信息(title)：",
                           	    	  id: "title",
                           	    	  setup: function( element, opts ) {
                           	    	  	this.setValue(opts.title);
                               	      },
                             	      commit: function(element, opts){
                             	    	  opts.title?element.setAttribute("title",opts.title):element.removeAttribute("title");
                             	      }
                           	      }
                        	   ]
                           }
                        ]
                    }
                ]
            },
            {
                id: 'tab-adv',
                label: '自定义样式',
                elements: [
                   {
                       type: 'vbox',
                       padding: 5,
                       children:[
                          {
                       	   type: 'hbox',
                       	   widths: ["50%","50%"],
                       	   children: [
	                  	      {
	                 	    	  type: "text",
	                 	    	  label: "样式类：",
	                 	    	  id: "className",
	                 	    	  setup: function( element, opts ) {
	                  	    	  	this.setValue(opts.className);
                        	      },
                        	      commit: function(element, opts){
                        	    	  opts.className?element.setAttribute("class",opts.className):element.removeAttribute("class");
                        	      }
	                 	      },
                       	      {
                       	    	  type: "text",
                       	    	  label: "ID：",
                       	    	  id: "id",
                       	    	  setup: function( element, opts ) {
                        	        this.setValue(opts.id);
                        	      },
                        	      commit: function(element, opts){
                        	    	  opts.id?element.setAttribute("id",opts.id):element.removeAttribute("id");
                        	      }
                       	      }
                       	   ]
                          },
                          {
                              type: 'textarea',
                              id: 'style',
                              label: '样式：',
                              setup: function(element,opts){
                        	  	 this.setValue(opts.style.styleString());
                          	  },
                          	  commit: function(element,opts){
                          		  var style = opts.style.styleString();
                          		  style?element.setAttribute("style",style):element.removeAttribute("style");
                          	  }
                          }
                       ]
                   }
                ]
            }
        ],
        onLoad: function(){
    		this.on('selectPage',function(evt){ //切换tab事件
    			var dialog = this;
    			var opts = dialog.options;
            	var data = evt.data;
            	if(data.page=='tab-basic'||data.commit=='tab-adv'){//切换到tab-basic或提交tab-adv数据
            		opts.id = trim(dialog.getValueOf( 'tab-adv', 'id' ));
            		opts.className = trim(dialog.getValueOf( 'tab-adv', 'className' ));
            		opts.style.parseStyle(dialog.getValueOf( 'tab-adv', 'style' ));
            	}else if(data.page=='tab-adv'||data.commit=='tab-basic'){//切换到tab-adv或提交tab-basic数据
            		opts.style.put('width',formatUnit(trim(dialog.getValueOf( 'tab-basic', 'width' ))));
            		opts.style.put('height',formatUnit(trim(dialog.getValueOf( 'tab-basic', 'height' ))));
            		opts.style.put('padding',formatUnit(trim(dialog.getValueOf( 'tab-basic', 'padding' ))));
            		opts.style.put('margin',formatUnit(trim(dialog.getValueOf( 'tab-basic', 'margin' ))));
            		opts.style.put('text-align',formatUnit(trim(dialog.getValueOf( 'tab-basic', 'textAlign' ))));
            		var bWidth = formatUnit(trim(dialog.getValueOf( 'tab-basic', 'border' )))
            		bWidth?opts.style.put('border',bWidth+" solid #ccc"):'';
            		opts.title = dialog.getValueOf( 'tab-basic', 'title' );
            	}else{
            		return;
            	}
            	dialog.setupContent( dialog.element, dialog.options);//调用setup更新值
            });
    	},
        onShow: function(){
    	 	var dialog = this;
            var selection = editor.getSelection();
            var currElement = selection.getStartElement();
            dialog.currElement = currElement;
    	 	initDialog(dialog,0,true);
    	},
        onOk: function() {
            var dialog = this;
            dialog.fire('selectPage',{commit: dialog._.currentTabId});//提交当前tab的数据
            dialog.commitContent(dialog.element, dialog.options);//调用commit方法更新元素值
        }
    };
});