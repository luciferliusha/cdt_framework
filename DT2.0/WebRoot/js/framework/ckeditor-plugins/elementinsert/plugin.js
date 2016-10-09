/**
 * 用于插入元素的插件
 */
CKEDITOR.plugins.add( 'elementinsert', {
//    icons: 'elementinsert', //按钮图标
    init: function( editor ) {
		CKEDITOR.dialog.add( 'elementInsert', this.path + 'dialogs/elementInsert.js' );
        /**
         * 执行按钮功能
         */
        editor.addCommand( 'elementInsert', new CKEDITOR.dialogCommand( 'elementInsert' ));
        
//        editor.ui.addButton( 'ElementInsert', { //按钮引用名
//            label: '插入元素',  //按钮的tooltip
//            command: 'elementInsert' //按钮执行的命令
//        });
        if ( editor.contextMenu ) {
            editor.addMenuGroup( 'templateGroup' );
            editor.addMenuItem( 'elementInsertItem', {
                label: '插入元素',
                //icon: this.path + 'icons/timestamp.png',
                command: 'elementInsert',
                group: 'templateGroup'
            });
            editor.contextMenu.addListener( function( element ) {
    			return {elementInsertItem:CKEDITOR.TRISTATE_OFF}; //选中
            });
        }
    }
});