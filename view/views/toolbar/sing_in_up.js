const action = require('../../actions/actions')

var sign_in_up = {
    view: 'button',
    id: 'toolbar_sing_in_up',
    type: 'icon',
    icon: 'mdi mdi-account-arrow-left',
    align: 'left',
    width: 40,
    click: function () {
        if ($$('right_sidebar')) {
            action.disableRightSidebar()
        } else {
            action.enableRightSidebar()
        }
    }
}
exports.sign_in_up=sign_in_up