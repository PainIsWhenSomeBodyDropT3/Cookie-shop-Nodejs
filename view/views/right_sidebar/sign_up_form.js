const api = require('../../apis/user')
const axios = require('axios')
var img_path;
var sign_up_form = ({
    view: "form",
    // height: 500,
    // css:'form',
    scroll: 'y',
    elements: [
        {
            view: "text", id: 'register_login', label: "Login", name: 'login', labelWidth: 150, required: true
            , invalidMessage: "Incorrect login type"
        },
        {
            view: "text", id: 'register_password', type: "Password", name: 'password', label: "Password", labelWidth: 150, required: true
            , invalidMessage: "Incorrect password type"
        },
        {
            view: "text", id: 'register_confirm_password', type: "Password", name: 'confirm_password', label: "Confirm password", labelWidth: 150, required: true
            , invalidMessage: "Passwords don't match"
        },
        {
            view: "uploader",
            value: "Upload or drop file here",
            id: 'loader',
            name: "files",
            link: "my_list",
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
            id: "my_list",
            type: "uploader",
            autoheight: true,
            borderless: true
        },
        {
            view: "button", value: "Register", css: "webix_primary",
            click: async function () {
                $$('reg_error').setValue('');
                if (this.getParentView().validate()) {
                    let login = $$('register_login').getValue();
                    let password = $$('register_password').getValue();
                    if (!img_path) {
                        img_path = 'v1614426855/uncknown_awk8cb.jpg'
                    }
                    let user = { login: login, password: password, pathToImg: img_path };
                    let user_login = { login: login }
                    let is_registered_json = await api.isUserRegistered(user_login);
                    if (is_registered_json.status!==200) {
                        $$('reg_error').setValue('This user has already exist');
                    } else {
                        console.log(user)
                        await api.registerUser(user);
                        $$('sign_in_up_multiview').setValue('sing_in')
                    }
                }

            }
        },
        {
            view: 'label', id: 'reg_error', label: '', align: 'center', css: "registration_error_label"
        }

    ],
    rules: {
        'login': function (value) {
            if (value) {
                return value.match('^([a-zA-Z0-9а-яА-Я]+){4,}$')
            }
            return false
        },
        'password': function (value) {
            if (value) {
                return value.match('^([a-zA-Z0-9а-яА-Я]+){4,}$')
            }
            return false
        },
        'confirm_password': function (value) {
            return value === $$('register_password').getValue()
        }
    },
});
exports.sign_up_form=sign_up_form;