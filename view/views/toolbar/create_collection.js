const {create_collection_popup} = require('../popup/create_collection')
const toolbar_create_collection = {
    view: 'button',
    id: 'toolbar_create_collection',
    label: 'Create',
    type: 'icon',
    icon: 'mdi mdi-mdi mdi-rhombus-split',
    width: 100,
   // align: 'right',
    click: function () {
        create_collection_popup.show();
    }
}
exports.toolbar_create_collection=toolbar_create_collection