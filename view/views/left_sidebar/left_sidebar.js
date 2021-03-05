const {left_sidebar_data} = require('./data')
const {collection_multiview} = require('../collection_multiview/collection_multiview')

var left_sidebar = {
    view: "sidebar",
    id: 'left_sidebar',
    scroll:'y',
    //type: "customIcons",
    multipleOpen: true,
    data: left_sidebar_data,
      on: {
          onAfterSelect: function (id) {
              if ($$('collection_multiview')) {
                  $$('collection_multiview').setValue(id);
            } else {
                  $$('cols').removeView('right_sidebar');
                  $$('cols').removeView('sign_in_up_multiview');
                  $$('cols').addView(collection_multiview, 1);
                  $$('collection_multiview').setValue(id);
              }
          }
      },
      ready: function () {
          var firstItem = this.getFirstId();
          this.select(firstItem);
      }
}
exports.left_sidebar=left_sidebar