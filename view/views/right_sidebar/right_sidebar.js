const {right_sidebar_data , sing_in_up_multiview_data} = require('./data')
var right_sidebar = {
    view: "sidebar",
    id: 'right_sidebar',
    type: "customIcons",
    position: "right",
    data: right_sidebar_data,
    on: {
        onAfterSelect: function (id) {
            if ($$('sign_in_up_multiview')) {
                $$('sign_in_up_multiview').setValue(id);
            } else {
                $$('cols').removeView('collection_multiview');
                $$('cols').addView(sign_in_up_multiview, 1);
                $$('sign_in_up_multiview').setValue(id);
            }
        }
    }
}

var sign_in_up_multiview = {
    view: 'multiview',
    id: 'sign_in_up_multiview',
    animate: false,
    cells: sing_in_up_multiview_data
}
exports.right_sidebar=right_sidebar
exports.sign_in_up_multiview=sign_in_up_multiview