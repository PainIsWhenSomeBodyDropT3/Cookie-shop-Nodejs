const api = require('../../apis/user')
const action = require('../../actions/actions')
var sign_in_form = ({
    view: "form",
    //  height: 500,
    scroll: 'y',
    elements: [
        {
            view: "text", id: 'user_login', name: 'login', label: "Login", required: true
            , invalidMessage: "Incorrect login type"
        },
        {
            view: "text", id: 'user_password', name: 'password', type: "password", label: "Password", required: true
            , invalidMessage: "Incorrect password type"
        },
        {
            view: "button", value: "Login", css: "webix_primary",
            click:  function () {
                if (this.getParentView().validate()) {
                    $$('log_error').setValue('');
                    let login = $$('user_login').getValue();
                    let password = $$('user_password').getValue();
                    (
                        async ()=> {
                            let user = {login: login, password: password};
                            let jwt = await api.loginUser(user);
                            if (jwt.status === 200) {
                                let jwtData = await jwt.json();
                                console.log('set token')
                                location.reload()
                                localStorage.setItem('jwt', jwtData)
                                action.afterUserLogin()
                            } else {
                                $$('log_error').setValue('Incorrect login or password');
                            }
                        }
                )()
                }

            }
        },
        {
            view: 'label', id: 'log_error', label: '', align: 'center', css: "login_error_label"
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
    }
});
exports.sign_in_form=sign_in_form