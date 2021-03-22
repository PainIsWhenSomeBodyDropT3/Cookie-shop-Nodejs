const {socket} = require('../../ws/ws')
var users_in_table = [
    {
        cols: [
            {
                view: 'button', label: 'Delete', type: 'iconButton', icon: 'trash',
                click: function () {
                    var sel = $$('admin_datatable').getSelectedId();
                    if (sel) {
                        let result = webix.ajax().sync().headers({
                            'Authorization': 'Bearer ' + localStorage.getItem('jwt') // any custom headers can be defined in such a way
                        }).del('/user/admin/' + sel.id);
                        console.log(result)
                        if (result.status === 200) {
                            $$('admin_datatable').remove(sel.row)
                            let message = {
                                action: 'delete_user',
                                userId: sel.id
                            }
                            socket.send(JSON.stringify(message))
                        }

                    } else return false
                }
            }
        ]
    },
    {
        view: "datatable",
        id: "admin_datatable",

        url: function () {
            $$('admin_datatable').load(function () {
                let result = webix.ajax().headers({
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt') // any custom headers can be defined in such a way
                }).get('/user/admin/all');
                if (result.status !== 404) {
                    console.log('result')
                    result.then(r => {
                        console.log(r)
                    })

                    console.log('result end')
                    return result;
                } else return ''
            });

        },
        resizeColumn: true,
        columns: [
            {id: 'id', header: [{text: '<span class="mdi mdi-filter"></span>'}], width: 50, sort: 'int'},
            {id: 'login', header: [{text: 'Login'}, {content: 'textFilter'}], width: 200},
            {
                id: 'collections', header: [{text: 'Collection count'}], width: 200, sort: 'int',
                template: function (obj) {
                    return obj['collections'];
                }
            },
            {
                id: 'items', header: [{text: 'Collection items count'}], width: 150, sort: 'int',
                template: function (obj) {
                    return obj['items'];
                }
            },
            {
                id: 'tags', header: [{text: 'Used tags count'}], width: 150, sort: 'int',
                template: function (obj) {
                    return obj['tags'];
                }
            },
            {
                id: 'comments', header: [{text: 'Item comments count'}], width: 150, sort: 'int',
                template: function (obj) {
                    return obj['comments'];
                }
            },
            {
                id: 'likes', header: [{text: 'Item likes count'}], width: 150, sort: 'int',
                template: function (obj) {
                    return obj['likes'];
                }
            },
            {header: [{text: 'Actions'}], template: ' {common.trashIcon}', fillspace: true}
        ],
        scroll: false,
        type: {
            trashIcon: '<span class="mdi mdi-delete"></span>',
            editIcon: '<span class="webix_kanban_icon kbi-pencil"></span>'
        },
        pager: 'pager',
        select: true,
        editable: true,
        //borderless:true,
        //yCount:13
        //autoConfig: true
    },
    {
        view: 'pager',
        id: 'pager',
        size: 13,
        group: 10,
        template: `{common.first()} {common.prev()} {common.pages()}
            {common.next()} {common.last()}`
    }
]

exports.users_in_table = users_in_table
