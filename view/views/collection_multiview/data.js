//let webix = require('../../webix.trial.complete/webix/codebase/webix.js')
let {update_delete_collection_popup} = require('../popup/update_delete_collection')
let user_api = require('../../apis/user')
const axios = require('axios')
var img_path;

function collectionData(header, id, data, isCollapsed) {
    return {
        header: header,
        collapsed: isCollapsed,
        body: {
            rows: [
                {
                    view: 'dataview',
                    id: id,
                    select: true,
                    url: function () {
                        $$(id).load(function () {
                            let result = webix.ajax().headers({
                                'Authorization': 'Bearer ' + localStorage.getItem('jwt') // any custom headers can be defined in such a way
                            }).get(data);
                            if (result.status !== 404) {
                                return result;
                            } else return ''
                        });

                    },
                    css: 'collection_box',
                    item: {
                        height: 340,
                        width: 400
                    },
                    on: {
                        onItemDblClick: function (id, e, node) {
                            {
                                (
                                    async () => {
                                        let response = await user_api.getByToken(localStorage.getItem('jwt'))
                                        if (response.status !== 403) {
                                            let item = this.getItem(id)
                                            update_delete_collection_popup(item).show()
                                        }
                                    }
                                )()
                            }
                        }
                    },
                    template:
                        `<div class='content'>

<img src="https://res.cloudinary.com/ivanverigo2000/image/upload/#PathToImg#" height="80%" width="100%" alt="No img"/>
<h1>#Name#</h1>
<div class="module">
  <p>#Description#</p>
</div>
</div>
`
                }
            ]
        }
    };
}


var offers = (header, id, data, isCollapsed) => {
    return {
        view: 'accordion',
        type: 'space',
        rows: [
            collectionData(header, id, data, isCollapsed)
        ]
    };
}



var item_user_offers = [
    {
        view: "button",
        css: "webix_primary",
        label: "Add new card",
        click: () => {
            $$("my_board").showEditor();
        }
    },
    {
        view: "scrollview",
        scroll: "x",
        id: 'scrollview',
        body:
            {
                view: "kanban",
                id: 'my_board',

                cols: [
                    {
                        header: "Book",
                        body: {view: "kanbanlist", status: "books", type: "my_cards"}
                    },
                    {
                        header: "Drink",
                        body: {view: "kanbanlist", status: "drinks", type: "my_cards"}
                    },
                    {
                        header: "Game",
                        body: {view: "kanbanlist", status: "games", type: "my_cards"}
                    },
                    {
                        header: "Other",
                        body: {view: "kanbanlist", status: "others", type: "my_cards"}
                    }
                ],
                editor: {
                    id: 'my_editor',
                    elements: [
                        {
                            view: "textarea",
                            name: "text",
                            height: 90,
                            label: "Description",
                            required: true,
                        },
                        {
                            view: "multicombo",
                            name: "tags",
                            label: "Tags",
                            options: '/tag/'
                        },
                        {
                            cols: [
                                {
                                    name: "user_id",
                                    id: 'combo_user_id',
                                    view: "combo",
                                    options: '/user/' + localStorage.getItem('jwt'),
                                    label: "Assign to",
                                    required: true,
                                },
                                {
                                    view: "richselect",
                                    id: 'collection_type_list',
                                    name: "$list",
                                    label: "Collection type",
                                    required: true,
                                    options: [
                                        {id: '0', value: "books"},
                                        {id: '1', value: "drinks"},
                                        {id: '2', value: "games"},
                                        {id: '3', value: "others"}
                                    ],
                                    on: {
                                        async onChange(current, prev) {
                                            $$('my_editor').disable();
                                            if ($$('user_collection_list')) {
                                                this.getParentView().removeView('user_collection_list');
                                            }
                                            this.getParentView().addView(
                                                {
                                                    view: "richselect",
                                                    id: "user_collection_list",
                                                    name: "user_collection_list",
                                                    label: "Collection",
                                                    labelPosition: "top",
                                                    required: true,
                                                    options: '/collection/' + $$('collection_type_list').getText() + '/' + localStorage.getItem('jwt')
                                                })
                                            $$('my_editor').enable();
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            view: "uploader",
                            value: "Upload or drop file here",
                            id: 'item_loader',
                            name: "files",
                            link: "item_list",
                            upload: "/upload",
                            multiple: false,
                            accept: "image/png, image/jpg, image/jpeg",
                            on: {
                                async onBeforeFileAdd(file) {

                                    let cloudnary_url = 'https://api.cloudinary.com/v1_1/ivanverigo2000/upload'
                                    let cloudnary_upload_preset = 'aohz2pju'
                                    const selectedFile = file.file;

                                    var form_data = new FormData();
                                    form_data.append('file', selectedFile);
                                    form_data.append('upload_preset', cloudnary_upload_preset);

                                    axios({
                                        url: cloudnary_url,
                                        method: 'POST',
                                        header: {
                                            'Content-Type': 'application/x-www-form-urlencoded'
                                        },
                                        data: form_data
                                    }).then(function (res) {
                                        let data1 = res.data.secure_url.split('/')[6];
                                        let data2 = res.data.secure_url.split('/')[7];
                                        let slash = '/';
                                        img_path = data1 + slash + data2;
                                        exports.img_path=img_path
                                        img_path=''
                                        alert('load done')
                                    })
                                }
                            }
                        },
                        {
                            view: "list",
                            id: "item_list",
                            type: "uploader",
                            autoheight: true,
                            borderless: true
                        },
                    ],
                    rules: {
                        text: webix.rules.isNotEmpty,
                        user_id: webix.rules.isNotEmpty,
                        user_collection_list: webix.rules.isNotEmpty,
                        $list: webix.rules.isNotEmpty,
                    }
                },
                url: function (){
                    $$('my_board').load(function () {
                        let result = webix.ajax().get('/item/all/'+localStorage.getItem('jwt'));
                        if (result.status !== 404) {
                            result.then(r=>{
                                console.log(r)
                            })
                            return result;
                        } else return ''
                    });
                },
                users: '/user/fullImgPath/' + localStorage.getItem('jwt'),
                tags: '/tag/',
                comments: {id: 'item_comment', activeUser: -1},
            }
    }
];
var item_offers = [
    {
        view: "scrollview",
        scroll: "x",
        id: 'users_scrollview',
        body:
            {
                view: "kanban",
                id: 'users_board',
                cols: [
                    {
                        header: "Book",
                        body: {view: "kanbanlist", status: "books", type: "users_cards"}
                    },
                    {
                        header: "Drink",
                        body: {view: "kanbanlist", status: "drinks", type: "users_cards"}
                    },
                    {
                        header: "Game",
                        body: {view: "kanbanlist", status: "games", type: "users_cards"}
                    },
                    {
                        header: "Other",
                        body: {view: "kanbanlist", status: "others", type: "users_cards"}
                    }
                ],
                url: function (){
                    $$('users_board').load(function () {
                        let result = webix.ajax().get('/item/allForUsers');
                        if (result.status !== 404) {
                            result.then(r=>{
                                console.log(r)
                            })
                            return result;
                        } else return ''
                    });
                },
                users: '/user/all',
                tags: '/tag/',
                comments: {id: 'item_comment', activeUser: -1},
            }
    }
];
var collection_multiview_data = [
    {id: 'book', rows: [offers('Books', 'books', '/collection/BOOK', false)]},
    {id: 'drink', rows: [offers('Drink', 'drinks', '/collection/DRINK', false)]},
    {id: 'game', rows: [offers('Games', 'games', '/collection/GAME', false)]},
    {id: 'other', rows: [offers('Others', 'others', '/collection/OTHER', false)]},
    {id: 'items', rows: item_offers},

    {id: 'user_book', rows: [offers('Books', 'user_books', '/user/collection/BOOK', false)]},
    {id: 'user_drink', rows: [offers('Drinks', 'user_drinks', '/user/collection/DRINK', false)]},
    {id: 'user_game', rows: [offers('Games', 'user_games', '/user/collection/GAME', false)]},
    {id: 'user_other', rows: [offers('Others', 'user_others', '/user/collection/OTHER', false)]},
    {id: 'user_items', rows: item_user_offers},
];


exports.collection_multiview_data = collection_multiview_data
exports.item_user_offers = item_user_offers
exports.item_offers = item_offers
exports.offers = offers


