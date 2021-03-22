const {label} = require('./label')
const {toolbar_menu} = require('./menu')
const {sign_in_up} = require('./sing_in_up')
const {clear_selection} = require('./clear_selection')

var main_toolbar = {
    id: 'main_toolbar',
    view: 'toolbar',
    elements: [
        toolbar_menu,
        label,
        clear_selection,
        sign_in_up
    ]
}
exports.main_toolbar = main_toolbar
