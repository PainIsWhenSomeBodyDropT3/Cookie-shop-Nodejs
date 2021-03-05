const {create_collection_popup} = require('../popup')
const toolbar_create_collection = {
    view: 'button',
    id: 'toolbar_create_collection',
    label: 'Create collection',
    align: 'left',
    click: function () {
        create_collection_popup.show();
    }
}
exports.toolbar_create_collection=toolbar_create_collection