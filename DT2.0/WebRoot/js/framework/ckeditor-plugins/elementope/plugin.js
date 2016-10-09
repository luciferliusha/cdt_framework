/**
 * 用于删除元素的插件
 */
CKEDITOR.plugins.add( 'elementope', {
    //icons: 'editstyle', //按钮图标
    init: function( editor ) {
    	CKEDITOR.dialog.add( 'elementOpe', this.path + 'dialogs/elementOpe.js' );
    	editor.addCommand('elementOpe', new CKEDITOR.dialogCommand( 'elementOpe' ));
        editor.addCommand( 'removeElements', { //删除当前元素及其子元素
        	 exec: function(editor){
	     		var el = editor.getSelection().getStartElement();//获取起始元素
	    		if(el){
	            	el.remove();
	    		}
         	}
         });
        editor.addCommand( 'removeElement', { //删除当前元素
       	 exec: function(editor){
	     		var el = editor.getSelection().getStartElement();//获取起始元素
	    		if(el){
	            	el.remove(true);
	    		}
        	}
        });
        
        if ( editor.contextMenu ) {
            editor.addMenuGroup( 'templateGroup' );
            
//            editor.addMenuItem( 'removeElementsItem', {
//                label: '删除元素及其子元素',
//                command: 'removeElements',
//                group: 'templateGroup'
//            });
//            editor.addMenuItem( 'elementOpeItem', {
//                label: '删除元素',
//                command: 'elementOpe',
//                group: 'templateGroup'
//            });
            editor.addMenuItem( 'removeElementItem', {
                label: '删除元素',
                command: 'removeElements',
                group: 'templateGroup'
            });
            editor.contextMenu.addListener( function( element ) {
        		var name = element.getName();
        		if(/^(html|body)$/.test(name)){
        			return;
        		}
    			return {elementOpeItem:CKEDITOR.TRISTATE_OFF,removeElementsItem:CKEDITOR.TRISTATE_OFF,removeElementItem:CKEDITOR.TRISTATE_OFF}; //未选中
            });
        }
    }
});