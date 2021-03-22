const axios = require('axios')
//const webix = require('../../webix.trial.complete/webix/codebase/webix.js')
const collection_api = require('../../apis/collection')
const user_api = require('../../apis/user')
const collectionType_api = require('../../apis/collectionType')
const {socket} = require('../../ws/ws')
var img_path;

const create_collection_popup = webix.ui({
    view: "popup",
    id: "create_collection_popup",
    body:
        {
            view: "form",
            id: 'create_collection_form',
            scroll: 'y',
            minHeight: 450,
            // height: 500,
            // css:'form',

            elements: [
                {
                    view: "text", id: 'collection_name', label: "Name", name: 'collection_name', labelWidth: 100, required: true
                },

                {
                    view: "textarea", id: 'collection_desc', label: "Description", name: 'collection_desc', labelWidth: 100, required: true
                },
                {
                    view: "select", id: 'collection_type', label: "Type", value: 'BOOK', options: [
                        { value: "BOOK" },
                        { value: "DRINK" },
                        { value: "GAME" },
                        { value: "OTHER" }
                    ]
                },
                { template: "Fields", type: "section" },

                {
                    view: "uploader",
                    value: "Upload or drop file here",
                    id: 'collection_loader',
                    name: "files",
                    link: "collection_list",
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
                                console.log(img_path)
                            })
                        }
                    }
                },
                {
                    view: "list",
                    id: "collection_list",
                    type: "uploader",
                    autoheight: true,
                    borderless: true
                },
                {
                    view: 'button', type: 'button', value: 'Create', css: "webix_primary",
                    click: async function () {
                        if (this.getParentView().validate()) {
                            let collection_name = $$('collection_name').getValue();
                            let res = await collection_api.isExist({ name: collection_name });
                            console.log(res)
                            if (res.status===404) {
                                let collection_desc = $$('collection_desc').getValue();
                                let collection_type = $$('collection_type').getValue();

                                let image = img_path ? img_path : 'v1614426855/uncknown_awk8cb.jpg';

                                let user = await user_api.getByToken(localStorage.getItem('jwt'));
                                if(user.status!==403) {
                                    let json_user = await user.json();
                                    let user_id = json_user['Id'];
                                    let collection_type_resp =await collectionType_api.get(collection_type)
                                    let collection_type_json = await collection_type_resp.json();


                                    let collection = {
                                        Name: collection_name,
                                        Description: collection_desc,
                                        PathToImg: image,
                                        UserId: user_id,
                                        CollectionTypeId:collection_type_json['Id']
                                    }
                                    console.log(collection);
                                    let response = await collection_api.create(collection);
                                    if(response!==500){
                                        let collection = await response.json();
                                        let message ={
                                            action:'create_collection',
                                            collection:collection
                                        }
                                        socket.send(JSON.stringify(message))
                                    }

                                    $$('create_collection_popup').hide()
                                }
                            } else {
                                $$('collection_error').setValue('This collection name already in use');
                            }
                        }
                    }
                },
                {
                    view: 'label', id: 'collection_error', label: '', align: 'center', css: "login_error_label"
                }
            ],
            rules: {
                'collection_name': function (value) {
                    if (value) {
                        return true;
                    }
                    return false;
                },
                'collection_desc': function (value) {

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
exports.create_collection_popup=create_collection_popup