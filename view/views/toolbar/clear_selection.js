const USERS= 'user_'
const clear_selection = {
    view: 'button',
    id: 'toolbar_clear_selection',
    type: 'icon',
    icon: 'mdi mdi-autorenew',
    width: 40,
    align: 'left',
    click: function () {
       /* $$('books').unselectAll();
        $$('drinks').unselectAll();
        $$('games').unselectAll();
        $$('others').unselectAll();

        $$(USERS+'books').unselectAll();
        $$(USERS+'drinks').unselectAll();
        $$(USERS+'games').unselectAll();
        $$(USERS+'others').unselectAll();*/

       location.reload()
    }
}
exports.clear_selection=clear_selection