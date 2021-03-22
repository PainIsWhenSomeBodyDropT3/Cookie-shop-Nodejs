const axios = require('axios')
//const webix = require('../../webix.trial.complete/webix/codebase/webix.js')
const collection_api = require('../../apis/collection')
const user_api = require('../../apis/user')
const collectionType_api = require('../../apis/collectionType')
const {socket} = require('../../ws/ws')
let UPDATE_COLLECTION = 'update_collection'
let DELETE_COLLECTION = 'delete_collection'
var img_path;

function updateDelete(item) {
    img_path = item.PathToImg
    return webix.ui({
        view: "popup",
        id: "update_delete_collection_popup",
        body:
            {
                view: "form",
                id: 'update_delete_collection_form',
                scroll: 'y',
                minHeight: 450,
                // height: 500,
                // css:'form',

                elements: [
                    {
                        view: "text",
                        id: 'change_collection_name',
                        label: "Name",
                        name: 'change_collection_name',
                        value: item.Name,
                        labelWidth: 100,
                        required: true
                    },
                    {
                        view: "textarea",
                        id: 'change_collection_desc',
                        label: "Description",
                        name: 'change_collection_desc',
                        value: item.Description,
                        labelWidth: 100,
                        required: true
                    },

                    {template: "Fields", type: "section"},
                    {
                        view: "uploader",
                        value: "Upload or drop file here",
                        id: 'change_collection_loader',
                        name: "files",
                        link: "change_collection_list",
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
                                })
                            }
                        }
                    },
                    {
                        view: "list",
                        id: "change_collection_list",
                        type: "uploader",
                        autoheight: true,
                        borderless: true
                    },

                    {
                        view: 'button', type: 'button', value: 'Update', css: "webix_primary",
                        click: async function () {
                            if (this.getParentView().validate()) {
                                let collection_name = $$('change_collection_name').getValue();
                                let res = await collection_api.isExist({name: collection_name});
                                if (res.status === 404) {
                                    let collection_desc = $$('change_collection_desc').getValue();

                                    let user = await user_api.getByToken(localStorage.getItem('jwt'));
                                    if (user.status !== 403) {
                                        let json_user = await user.json();
                                        let user_id = json_user['Id'];

                                        let collection = {
                                            Id: item.Id,
                                            Name: collection_name,
                                            Description: collection_desc,
                                            PathToImg: img_path,
                                            UserId: user_id,
                                        }
                                        if (item.UserId === collection.UserId) {
                                            let response = await collection_api.update(collection);
                                            if (response !== 500) {
                                                let collection = await response.json();
                                                let message = {
                                                    action: UPDATE_COLLECTION,
                                                    collection: collection
                                                }
                                                socket.send(JSON.stringify(message))
                                            }
                                            $$('update_delete_collection_popup').hide()
                                        } else {
                                            $$('collection_error').setValue('You are not owner of this collection');
                                        }
                                    }
                                } else {
                                    $$('collection_error').setValue('This collection name already in use');
                                }
                            }
                        }
                    },
                    {
                        view: 'button', type: 'button', value: 'Delete', css: "webix_danger",
                        click: async function () {
                            let user = await user_api.getByToken(localStorage.getItem('jwt'));
                            if (user.status !== 403) {
                                let json_user = await user.json();
                                let user_id = json_user['Id'];
                                if (item.UserId === user_id) {
                                    let response = await collection_api.destroy({Id: item.Id})
                                    if (response.status === 200) {
                                        let message = {
                                            action: DELETE_COLLECTION,
                                            collection: item
                                        }
                                        $$('my_board').refresh()
                                        socket.send(JSON.stringify(message))
                                    }
                                    $$('update_delete_collection_popup').hide()
                                }else {
                                    $$('collection_error').setValue('You are not owner of this collection');
                                }

                            }
                        }
                    },
                    {
                        view: 'label', id: 'collection_error', label: '', align: 'center', css: "login_error_label"
                    }
                ],
                rules: {
                    'change_collection_name': function (value) {
                        if (value) {
                            return true;
                        }
                        return false;
                    },
                    'change_collection_desc': function (value) {

                        if (value) {
                            return true;
                        }
                        return false;
                    }
                }
            },

        modal: false,
        resize: true
    });
}

exports.update_delete_collection_popup = updateDelete