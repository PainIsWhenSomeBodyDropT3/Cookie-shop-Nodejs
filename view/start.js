/*//const webix = require('./webix.trial.complete/webix/codebase/webix.js')
const kanban=require('./webix.trial.complete/kanban/codebase/kanban.js')*/
const {socket} = require('./ws/ws')
const {main_toolbar} = require('./views/toolbar/toolbar')
const {left_sidebar} = require('./views/left_sidebar/left_sidebar')
const {collection_multiview} = require('./views/collection_multiview/collection_multiview')
const action = require('./actions/actions')
const userApi = require('./apis/user')
const itemApi = require('./apis/item')
const itemTag = require('./apis/itemTag')

async function saveTag(item_id, tags) {
    for (let i = 0; i < tags.length; i++) {
        await itemTag.create({ItemId: item_id, TagId: tags[i]})
    }
}

function saveItem(obj, img_path) {
    let item = {
        Status: obj.status,
        Description: obj.text,
        PathToImg: img_path,
        CollectionId: obj.user_collection_list,
    };
    (
        async () => {
            if (obj['itemId']) {
                console.log('update')
                let userResult = await userApi.getByToken(localStorage.getItem('jwt'))
                if(userResult.status!==403){
                    let user = await userResult.json()
                    let owner = obj.user_id
                    obj.user_id=user.Id
                    await itemApi.update(obj)
                    obj.user_id=owner



                }

            } else {
                let result = await itemApi.create(item)
                if (result.status !== 500) {
                    let item = await result.json();
                    obj['itemId'] = item.Id
                    await saveTag(item.Id, obj.tags)
                }
                let message ={
                    action:'create_item',
                    item:obj
                }
                socket.send(JSON.stringify(message))
            }
            console.log(obj)
            obj.action = ''
        }
    )()
}


webix.type(webix.ui.tree,
    {
        baseType: "sideBar", // inherit everything else from sidebar type
        name: "customIcons",
        icon: function (obj, common) { // custom rendering pattern for icons
            if (obj.icon) {
                return `<span class='webix_icon webix_sidebar_icon ${obj.icon} '></span>`;
            }
            return "";
        }
    });

webix.type(webix.ui.kanbanlist,
    {
        name: "my_cards",
        icons: [
            {
                id: "comments",
                icon: "webix_kanban_icon kbi-comment",
                show: function (t, e) {
                    return !!e.config.comments
                },
                template: function (t) {
                    return t.comments && t.comments.length || ""
                }
            },
            /*{
                id: "my_editor_icon",
                icon: "webix_kanban_icon kbi-pencil",
                show: function (t, e) {
                    return e.config.editor
                }
            },*/
            {
               id:'my_likes', view: 'button', type: 'icon', icon: "mdi mdi-thumb-up",
                template: function (obj) {
                    if (!obj.likes) {
                        obj['likes'] = 0
                    }
                    return obj.likes
                },
                click: function (itemId) {
                    let data
                    var item = $$('my_board').getItem(itemId);
                    let result = webix.ajax().sync().headers({
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt') // any custom headers can be defined in such a way
                    }).post('/like/isExist', {itemId: item.itemId})

                    if (result.status === 404) {
                        let result = webix.ajax().sync().headers({
                            'Authorization': 'Bearer ' + localStorage.getItem('jwt') // any custom headers can be defined in such a way
                        }).post('/like/create', {itemId: item.itemId})
                        data = result.responseText


                    }

                    if (result.status === 200) {
                        let result = webix.ajax().sync().headers({
                            'Authorization': 'Bearer ' + localStorage.getItem('jwt') // any custom headers can be defined in such a way
                        }).del('/like/delete', {itemId: item.itemId})
                        data = result.responseText


                    }

                    item = $$('my_board').getItem(itemId);
                    item.likes = data
                    $$('my_board').updateItem(itemId, item);
                }

            }
        ],
        templateAvatar: function (t, e, i) {
            var n = i._users, a = t.user_id && n.exists(t.user_id) ? n.getItem(t.user_id) : {};
            return a.image ? "<img class='webix_kanban_avatar' src='" + a.image + "' title='" + (a.value || "") + "'>" : "<span class='webix_icon webix_kanban_icon kbi-account' title='" + (a.value || "") + "'></span>"
        },
        templateBody: function (obj) {

            let {img_path} = require('./views/collection_multiview/data')
            console.log(img_path)
            img_path = img_path ? img_path : 'v1614426855/uncknown_awk8cb.jpg'
            obj['PathToImg'] = img_path
            if (obj['image'] && obj['PathToImg'] === 'v1614426855/uncknown_awk8cb.jpg') {
                img_path = obj['image']
            }
            console.log(obj)
            let html = ''
            html += `<div class='content'>`
            html += "<img class='image' width='80%' src='https://res.cloudinary.com/ivanverigo2000/image/upload/" + img_path + "'/>"
            html += `<div class="module">`
            html += "<p>" + obj.text + "</p>"
            html += ` </div>`
            html += `  </div>`
            if (obj.action !== 'click') {
                saveItem(obj, img_path)
            }


            return html;
        }
    },
);
webix.type(webix.ui.kanbanlist,
    {
        name: "users_cards",
        icons: [
            {
                id: "comments",
                icon: "webix_kanban_icon kbi-comment",
                show: function (t, e) {
                    return !!e.config.comments
                },
                template: function (t) {
                    return t.comments && t.comments.length || ""
                }
            },
            {
                id: 'likes', view: 'button', type: 'icon', icon: "mdi mdi-thumb-up",
                template: function (obj) {
                    if (!obj.likes) {
                        obj['likes'] = 0
                    }
                    return obj.likes
                },
                click: function (itemId) {
                    let data
                    var item = $$('users_board').getItem(itemId);
                    let result = webix.ajax().sync().headers({
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt') // any custom headers can be defined in such a way
                    }).post('/like/isExist', {itemId: item.itemId})
                    if (result.status !== 403) {

                        if (result.status === 404) {
                            let result = webix.ajax().sync().headers({
                                'Authorization': 'Bearer ' + localStorage.getItem('jwt') // any custom headers can be defined in such a way
                            }).post('/like/create', {itemId: item.itemId})

                            if (result.status !== 403) {
                                data = result.responseText
                                item = $$('users_board').getItem(itemId);
                                item.likes = data
                                $$('users_board').updateItem(itemId, item);

                            }
                        }

                        if (result.status === 200) {
                            let result = webix.ajax().sync().headers({
                                'Authorization': 'Bearer ' + localStorage.getItem('jwt') // any custom headers can be defined in such a way
                            }).del('/like/delete', {itemId: item.itemId})

                            if (result.status !== 403) {
                                data = result.responseText
                                item = $$('users_board').getItem(itemId);
                                item.likes = data
                                $$('users_board').updateItem(itemId, item);

                            }
                        }

                    }
                }

            },

        ],
        templateAvatar: function (t, e, i) {
            var n = i._users, a = t.user_id && n.exists(t.user_id) ? n.getItem(t.user_id) : {};
            return a.image ? "<img class='webix_kanban_avatar' src='" + a.image + "' title='" + (a.value || "") + "'>" : "<span class='webix_icon webix_kanban_icon kbi-account' title='" + (a.value || "") + "'></span>"
        },
        templateBody: function (obj) {

            let {img_path} = require('./views/collection_multiview/data')
            console.log(img_path)
            img_path = img_path ? img_path : 'v1614426855/uncknown_awk8cb.jpg'
            obj['PathToImg'] = img_path
            if (obj['image'] && obj['PathToImg'] === 'v1614426855/uncknown_awk8cb.jpg') {
                img_path = obj['image']
            }
            console.log(obj)
            let html = ''
            html += `<div class='content'>`
            html += "<img class='image' width='80%' src='https://res.cloudinary.com/ivanverigo2000/image/upload/" + img_path + "'/>"
            html += `<div class="module">`
            html += "<p>" + obj.text + "</p>"
            html += ` </div>`
            html += `  </div>`
            if (obj.action !== 'click') {
                saveItem(obj, img_path)
            }


            return html;
        }
    }
)


webix.ready(function () {
    if (!webix.env.touch && webix.env.scrollSize)
        webix.CustomScroll.init();

    //  console.log($$('combo_user_id'))
    webix.ui({
        rows: [
            main_toolbar,
            {
                id: 'cols',
                cols: [
                    left_sidebar,
                    collection_multiview
                ]
            }
        ]
    });


    if (localStorage.getItem('jwt') !== null) {
        (
            async () => {
                let ADMIN = 1;
                let REGISTERED = 2;
                let result = await userApi.getByToken(localStorage.getItem('jwt'))
                if (result.status !== 403) {
                    let user = await result.json();
                    if (user.UserRoleId === ADMIN) {
                        action.afterAdminLogin();
                    }
                    if (user.UserRoleId === REGISTERED) {
                        action.afterUserLogin();
                    }
                }else{
                    localStorage.removeItem('jwt')
                }
            }
        )()
    }else{
        action.afterUserLogout();
    }


})
