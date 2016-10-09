/**
 * 用于给元素添加component_drop（可拖入构件区域的className）
 * 排除了body和html标签，内部注释掉的是按钮功能！！
 */
CKEDITOR.plugins.add( 'dropclass', {
    //icons: 'dropclass', //按钮图标
    init: function( editor ) {
        /**
         * 执行按钮功能
         */
        editor.addCommand( 'toggleDropClass', {
            exec: function( editor ) {
        		var el = editor.getSelection().getStartElement();//获取起始元素
        		if(el){
                	var parents = el.getParents(true);
                	for(var i=0;i<parents.length;i++){
                		var e = parents[i];
                		var name = e.getName();
                		if(/^(html|body)$/.test(name)){
                			break;
                		}else if(!e.hasClass('component_drop')){
                			e.addClass("component_drop");
                			//editor.ui.get('DropClass').setState(CKEDITOR.TRISTATE_ON);
                			break;
                		}else if(e.hasClass('component_drop')){
                			e.removeClass("component_drop");
                			//editor.ui.get('DropClass').setState(CKEDITOR.TRISTATE_OFF);
                			break;
                		}
                	}
        		}
            }
        });
        
        /**
         * 按钮状态更新
         */
        /*edit.on('selectionChange',function(evt){
        	var editor = evt.editor;
    		var el = editor.getSelection().getStartElement();//获取起始元素
    		if(el){
            	var parents = el.getParents(true);
            	for(var i=0;i<parents.length;i++){
            		var e = parents[i];
            		var name = e.getName();
            		if(/^(html|body)$/.test(name)){
            			editor.ui.get('DropClass').setState(CKEDITOR.TRISTATE_OFF);
            			break;
            		}else if(e.hasClass('component_drop')){
            			editor.ui.get('DropClass').setState(CKEDITOR.TRISTATE_ON);
            			break;
            		}else if(!e.hasClass('component_drop')){
            			editor.ui.get('DropClass').setState(CKEDITOR.TRISTATE_OFF);
            			break;
            		}
            	}
    		}
        });
        editor.ui.addButton( 'DropClass', { //按钮引用名
            label: '可拖入构件区域',  //按钮的tooltip
            command: 'toggleDropClass' //按钮执行的命令
        });*/
        if ( editor.contextMenu ) {
            editor.addMenuGroup( 'templateGroup' );
            editor.addMenuItem( 'dropItem', {
                label: '设置/取消可拖入构件区域',
                //icon: this.path + 'icons/timestamp.png',
                command: 'toggleDropClass',
                group: 'templateGroup'
            });
            editor.contextMenu.addListener( function( element ) {
            	var parents = element.getParents(true);
            	for(var i=0;i<parents.length;i++){
            		var e = parents[i];
            		var name = e.getName();
            		if(/^(html|body)$/.test(name)){
            			return;
            		}else if(e.hasClass('component_drop')){
            			return {dropItem:CKEDITOR.TRISTATE_ON}; //选中
            		}else if(!e.hasClass('component_drop')){
            			return {dropItem:CKEDITOR.TRISTATE_OFF}; //未选中
            		}
            	}
            });
        }
    }
});