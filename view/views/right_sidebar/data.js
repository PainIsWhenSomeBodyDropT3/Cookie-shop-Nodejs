var {sign_in_form} = require('./sign_in_form')
var {sign_up_form} = require('./sign_up_form')
var right_sidebar_data = [
    { id: 'sing_in', icon: 'mdi mdi-login', value: 'Sign In' },
    { id: 'sing_up', icon: 'mdi mdi-draw', value: 'Sign Up' }
];




var sing_in_up_multiview_data = [
    { id: 'sing_in', rows: [sign_in_form] },
    { id: 'sing_up', rows: [sign_up_form] },
];



exports.right_sidebar_data=right_sidebar_data
exports.sing_in_up_multiview_data=sing_in_up_multiview_data