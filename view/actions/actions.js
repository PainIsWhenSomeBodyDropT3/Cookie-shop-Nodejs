const logout = require('../views/toolbar/logout_button')
const login = require('../views/toolbar/sing_in_up')
const clear = require('../views/toolbar/clear_selection')
const {collection_multiview} = require('../views/collection_multiview/collection_multiview')
const {right_sidebar, sign_in_up_multiview} = require('../views/right_sidebar/right_sidebar')
const {collection_multiview_data, item_user_offers, item_offers, offers} = require('../views/collection_multiview/data')
const {users_in_table} = require('../views/collection_multiview/admin_data')
const {left_sidebar_data} = require('../views/left_sidebar/data')
const {toolbar_create_collection} = require('../views/toolbar/create_collection')
const {create_collection_popup} = require('../views/popup/create_collection')
const {update_delete_collection_popup} = require('../views/popup/update_delete_collection')
const userApi = require('../apis/user')
const itemApi = require('../apis/item')
const {socket} = require('../ws/ws')

function updateLeftSideUserBar() {
    let newData = []

    newData.push(
        {
            id: "home", icon: "mdi mdi-home", value: "Home", data: [
                {
                    id: 'collections', icon: 'mdi mdi-rhombus-split', value: 'Collections', data: [
                        {id: 'book', icon: 'mdi mdi-book', value: 'Book'},
                        {id: 'drink', icon: 'mdi mdi-bottle-wine', value: 'Drink'},
                        {id: 'game', icon: 'mdi mdi-controller-classic', value: 'Game'},
                        {id: 'other', icon: 'mdi mdi-skull-crossbones', value: 'Other'}
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
                        {id: 'user_book', icon: 'mdi mdi-book', value: 'Book'},
                        {id: 'user_drink', icon: 'mdi mdi-bottle-wine', value: 'Drink'},
                        {id: 'user_game', icon: 'mdi mdi-controller-classic', value: 'Game'},
                        {id: 'user_other', icon: 'mdi mdi-skull-crossbones', value: 'Other'},
                    ]
                },
                {id: 'user_items', icon: 'mdi mdi-sitemap', value: 'Items'},
            ]
        })
    $$('cols').removeView('left_sidebar')
    $$('cols').addView({
        view: "sidebar",
        id: 'left_sidebar',
        scroll: 'y',
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
    }, 0)
}
function updateLeftSideAdminBar() {
    let newData = []

    newData.push(
        {
            id: "home", icon: "mdi mdi-home", value: "Home", data: [
                {
                    id: 'collections', icon: 'mdi mdi-rhombus-split', value: 'Collections', data: [
                        {id: 'book', icon: 'mdi mdi-book', value: 'Book'},
                        {id: 'drink', icon: 'mdi mdi-bottle-wine', value: 'Drink'},
                        {id: 'game', icon: 'mdi mdi-controller-classic', value: 'Game'},
                        {id: 'other', icon: 'mdi mdi-skull-crossbones', value: 'Other'}
                    ]
                },
                {
                    id: 'items', icon: 'mdi mdi-sitemap', value: 'Items'
                }
            ]
        },
        {
            id: "users", icon: 'mdi mdi-account', value: 'Users'
        })
    $$('cols').removeView('left_sidebar')
    $$('cols').addView({
        view: "sidebar",
        id: 'left_sidebar',
        scroll: 'y',
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
    }, 0)
}

function rollbackLeftSideBar() {
    let newData = [];
    newData.push({
        id: "home", icon: "mdi mdi-home", value: "Home", data: [
            {
                id: 'collections', icon: 'mdi mdi-rhombus-split', value: 'Collections', data: [
                    {id: 'book', icon: 'mdi mdi-book', value: 'Book'},
                    {id: 'drink', icon: 'mdi mdi-bottle-wine', value: 'Drink'},
                    {id: 'game', icon: 'mdi mdi-controller-classic', value: 'Game'},
                    {id: 'other', icon: 'mdi mdi-skull-crossbones', value: 'Other'}
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
        scroll: 'y',
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
    }, 0)
}


function disableRightSidebar() {
    $$('cols').removeView('right_sidebar');
    $$('cols').removeView('sign_in_up_multiview');
    //  $$('left_sidebar').toggle();
    if (!$$('collection_multiview')) {
        $$('cols').addView(collection_multiview, 1);
    }
}

function commentSetup() {
    /*(
        async () => {
            let res = await userApi.getByToken(localStorage.getItem('jwt'))
            if(res.status!==403) {
                let user = await res.json()
                console.log(user)
                $$("item_comment").setCurrentUser(user['Id']);
            }
        }
    )()*/

}

function removeItem(obj) {
    let removeObj = {
        id: obj.itemId
    };
    (
        async () => {
            await itemApi.remove(removeObj)
            obj.action = ''
            let message ={
                action:'delete_item',
                item:obj
            }
            socket.send(JSON.stringify(message))
        }
    )()
}

function genUserItems() {
    $$('cols').removeView('collection_multiview')
    let data = []
    data.push({id: 'book', rows: [offers('Books', 'books', '/collection/BOOK', false)]},
        {id: 'drink', rows: [offers('Drink', 'drinks', '/collection/DRINK', false)]},
        {id: 'game', rows: [offers('Games', 'games', '/collection/GAME', false)]},
        {id: 'other', rows: [offers('Others', 'others', '/collection/OTHER', false)]},
        {id: 'items', rows: item_offers},

        {id: 'user_book', rows: [offers('Books', 'user_books', '/user/collection/BOOK', false)]},
        {id: 'user_drink', rows: [offers('Drinks', 'user_drinks', '/user/collection/DRINK', false)]},
        {id: 'user_game', rows: [offers('Games', 'user_games', '/user/collection/GAME', false)]},
        {id: 'user_other', rows: [offers('Others', 'user_others', '/user/collection/OTHER', false)]},
        {id: 'user_items', rows: item_user_offers})
    $$('cols').addView({
        view: 'multiview',
        id: 'collection_multiview',
        animate: false,
        cells: data
    }, 1)
    $$('my_board').attachEvent("onBeforeEditorAction",
        function (action, editor, obj) {
            console.log(action)
            obj['action'] = action
            if (action === "save" && editor.getForm().validate()) {
                return true;
            } else if (action === "remove") {
                $$("my_board").remove(obj.id)
                $$("my_board").refresh()
                removeItem(obj)
                let message ={
                    action:'remove_item',
                    item:obj
                }
                socket.send(JSON.stringify(message))
                editor.hide()
            }
            return false;

        });
    $$("my_board").attachEvent("onListBeforeDrag", function(context,ev,list){
        return false
    });
    $$("users_board").attachEvent("onListBeforeDrag", function(context,ev,list){
        return false
    });

}
function genAdminItems(){
    $$('cols').removeView('collection_multiview')
    let data = []
    data.push({id: 'book', rows: [offers('Books', 'books', '/collection/BOOK', false)]},
        {id: 'drink', rows: [offers('Drink', 'drinks', '/collection/DRINK', false)]},
        {id: 'game', rows: [offers('Games', 'games', '/collection/GAME', false)]},
        {id: 'other', rows: [offers('Others', 'others', '/collection/OTHER', false)]},
        {id: 'items', rows: item_offers},

        {id: 'users', rows: users_in_table})
    $$('cols').addView({
        view: 'multiview',
        id: 'collection_multiview',
        animate: false,
        cells: data
    }, 1)

}

function delAdminItems() {
    $$('collection_multiview').removeView('users')
}
function delUserItems() {
    $$('collection_multiview').removeView('user_items')
}

exports.afterUserLogin = function () {
    $$('main_toolbar').removeView('toolbar_sing_in_up');
    $$('main_toolbar').removeView('toolbar_clear_selection');
    $$('main_toolbar').addView(toolbar_create_collection, -1)
    $$('main_toolbar').addView(clear.clear_selection, -1)
    $$('main_toolbar').addView(logout.logout, -1);
    disableRightSidebar();
    updateLeftSideUserBar();
    commentSetup()
    genUserItems()
}
exports.afterAdminLogin = function (){
    $$('main_toolbar').removeView('toolbar_sing_in_up');
    $$('main_toolbar').removeView('toolbar_clear_selection');
    $$('main_toolbar').addView(clear.clear_selection, -1)
    $$('main_toolbar').addView(logout.logout, -1);
    disableRightSidebar();
    updateLeftSideAdminBar();
    genAdminItems()
}

exports.afterAdminLogout = function (){
    $$('main_toolbar').removeView('logout_button');
    $$('main_toolbar').addView(login.sign_in_up, -1);
    localStorage.removeItem('jwt')
    rollbackLeftSideBar();
    $$('collection_multiview').setValue('book')
    delAdminItems()
}

exports.afterUserLogout = function () {
    $$('main_toolbar').removeView('logout_button');
    $$('main_toolbar').addView(login.sign_in_up, -1);
    localStorage.removeItem('jwt')
    rollbackLeftSideBar();
    $$('main_toolbar').removeView('toolbar_create_collection')
    $$('collection_multiview').setValue('book')
    $$('collection_multiview').removeView('user_items')
    delUserItems()
    create_collection_popup.hide();
    update_delete_collection_popup('').hide()

}
exports.enableRightSidebar = function () {
    //  $$('left_sidebar').toggle();
    $$('cols').addView(right_sidebar, -1)
    $$('cols').addView(sign_in_up_multiview, 1)
    $$('cols').removeView('collection_multiview')
}



exports.disableRightSidebar = disableRightSidebar