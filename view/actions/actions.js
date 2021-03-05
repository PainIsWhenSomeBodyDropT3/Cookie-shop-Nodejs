const logout = require('../views/toolbar/logout_button')
const login = require('../views/toolbar/sing_in_up')
const {collection_multiview} = require('../views/collection_multiview/collection_multiview')
const {right_sidebar, sign_in_up_multiview} = require('../views/right_sidebar/right_sidebar')
const {collection_multiview_data} = require('../views/collection_multiview/data')
const {left_sidebar_data} = require('../views/left_sidebar/data')
const {toolbar_create_collection} = require('../views/toolbar/create_collection')
const {create_collection_popup} = require('../views/popup')

function updateLeftSideBar(){
    let newData=[]

    newData.push(
        {
            id: "home", icon: "mdi mdi-home", value: "Home", data: [
                {
                    id: 'collections', icon: 'mdi mdi-rhombus-split', value: 'Collections', data: [
                        { id: 'book', icon: 'mdi mdi-book', value: 'Book' },
                        { id: 'drink', icon: 'mdi mdi-bottle-wine', value: 'Drink' },
                        { id: 'game', icon: 'mdi mdi-controller-classic', value: 'Game' },
                        { id: 'other', icon: 'mdi mdi-skull-crossbones', value: 'Other' }
                    ]
                },
                {
                    id: 'items', icon: 'mdi mdi-sitemap', value: 'Items'
                }
            ]
        },
        {
            id: "user", icon: 'mdi mdi-account', value: 'User', data: [
                {
                    id: 'user_collections', icon: 'mdi mdi-rhombus-split', value: 'Collections', data: [
                        { id: 'user_book', icon: 'mdi mdi-book', value: 'Book' },
                        { id: 'user_drink', icon: 'mdi mdi-bottle-wine', value: 'Drink' },
                        { id: 'user_game', icon: 'mdi mdi-controller-classic', value: 'Game' },
                        { id: 'user_other', icon: 'mdi mdi-skull-crossbones', value: 'Other' },
                    ]
                },
                { id: 'user_items', icon: 'mdi mdi-sitemap', value: 'Items' },
                { id: 'user_items_in_table', icon: 'mdi mdi-table-account', value: 'Items in table' },

            ]
        })
    $$('cols').removeView('left_sidebar')
    $$('cols').addView({
        view: "sidebar",
        id: 'left_sidebar',
        scroll:'y',
        //type: "customIcons",
        multipleOpen: true,
        data: newData,
        on: {
            onAfterSelect: function (id) {
                $$('collection_multiview').setValue(id);
            }
        },
        ready: function () {
            var firstItem = this.getFirstId();
            this.select(firstItem);
        }
    },0)
}
function rollbackLeftSideBar(){
    let newData=[];
    newData.push({
        id: "home", icon: "mdi mdi-home", value: "Home", data: [
            {
                id: 'collections', icon: 'mdi mdi-rhombus-split', value: 'Collections', data: [
                    { id: 'book', icon: 'mdi mdi-book', value: 'Book' },
                    { id: 'drink', icon: 'mdi mdi-bottle-wine', value: 'Drink' },
                    { id: 'game', icon: 'mdi mdi-controller-classic', value: 'Game' },
                    { id: 'other', icon: 'mdi mdi-skull-crossbones', value: 'Other' }
                ]
            },
            {
                id: 'items', icon: 'mdi mdi-sitemap', value: 'Items'
            }
        ]

    })
    $$('cols').removeView('left_sidebar')
    $$('cols').addView({
        view: "sidebar",
        id: 'left_sidebar',
        scroll:'y',
        //type: "customIcons",
        multipleOpen: true,
        data: newData,
        on: {
            onAfterSelect: function (id) {
                $$('collection_multiview').setValue(id);
            }
        },
        ready: function () {
            var firstItem = this.getFirstId();
            this.select(firstItem);
        }
    },0)
}


function disableRightSidebar() {
    $$('cols').removeView('right_sidebar');
    $$('cols').removeView('sign_in_up_multiview');
    if (!$$('collection_multiview')) {
        $$('cols').addView(collection_multiview, 1);
    }
}



exports.afterUserLogin = function () {
    $$('main_toolbar').removeView('toolbar_sing_in_up');
    $$('main_toolbar').addView(toolbar_create_collection,-1)
    $$('main_toolbar').addView(logout.logout, -1);
    disableRightSidebar();
    updateLeftSideBar();


}
exports.afterUserLogout = function () {
    $$('main_toolbar').removeView('logout_button');
    $$('main_toolbar').addView(login.sign_in_up, -1);
    localStorage.removeItem('jwt')
    rollbackLeftSideBar();
    $$('main_toolbar').removeView('toolbar_create_collection')
    $$('collection_multiview').setValue('book')
    create_collection_popup.hide();
}
exports.enableRightSidebar = function () {
    $$('cols').addView(right_sidebar, -1)
    $$('cols').addView(sign_in_up_multiview, 1)
    $$('cols').removeView('collection_multiview')
}
exports.disableRightSidebar = disableRightSidebar