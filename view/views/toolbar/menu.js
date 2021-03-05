var toolbar_menu={
    id: 'toolbar_menu',
    view: 'button',
    type: 'icon',
    icon: 'mdi mdi-menu',
    width: 50,
    align: 'left',
    click: function () {
        $$('left_sidebar').toggle();
    }
}
exports.toolbar_menu=toolbar_menu