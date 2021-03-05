const action = require('../../actions/actions')
const logout={
    id:'logout_button',
    view:'button',
    type:'button',
    label: 'Logout',
    align: 'left',
    click: function () {
        action.afterUserLogout()
    }
}
exports.logout=logout;