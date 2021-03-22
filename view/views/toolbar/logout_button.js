const action = require('../../actions/actions')
const logout={
    id:'logout_button',
    view:'button',
    type: 'icon',
    icon: 'mdi mdi-account-arrow-right',
    width: 40,
   // label: 'Logout',
    align: 'left',
    click: function () {
        action.afterUserLogout()
    }
}
exports.logout=logout;