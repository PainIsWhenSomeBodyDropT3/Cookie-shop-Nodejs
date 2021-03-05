const action = require('../../actions/actions')

var sign_in_up = {
    view: 'button',
    id: 'toolbar_sing_in_up',
    label: 'Sign in/Sign up',
    align: 'left',
    click: function () {
        if ($$('right_sidebar')) {
            action.disableRightSidebar()
        } else {
            action.enableRightSidebar()
        }
    }
}
exports.sign_in_up=sign_in_up