/**
 * 用于编辑元素样式 插件
 */
CKEDITOR.plugins.add( 'editstyle', {
//    icons: 'editstyle', //按钮图标
    init: function( editor ) {
        editor.addCommand( 'editStyle',  new CKEDITOR.dialogCommand( 'editStyle' ));
        CKEDITOR.dialog.add( 'editStyle', this.path + 'dialogs/editstyle.js' )
        
        if ( editor.contextMenu ) {
            editor.addMenuGroup( 'templateGroup' );
            editor.addMenuItem( 'editStyleItem', {
                label: '编辑样式',
                //icon: this.path + 'icons/timestamp.png',
                command: 'editStyle',
                group: 'templateGroup'
            });
            editor.contextMenu.addListener( function( element ) {
        		var name = element.getName();
        		if(/^(html)|(body)$/.test(name)){
        			return;
        		}
    			return {editStyleItem:CKEDITOR.TRISTATE_OFF}; //未选中
            });
        }
    }
});