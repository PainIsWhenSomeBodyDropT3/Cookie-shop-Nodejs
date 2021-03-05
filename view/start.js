const webix = require('./webix.trial.complete/webix/codebase/webix.js')
const {main_toolbar} = require('./views/toolbar/toolbar')
const {left_sidebar} = require('./views/left_sidebar/left_sidebar')
const {collection_multiview} = require('./views/collection_multiview/collection_multiview')
const action = require('./actions/actions')
const userApi = require('./apis/user')


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

webix.ready( function () {

    if (!webix.env.touch && webix.env.scrollSize)
        webix.CustomScroll.init();
  let u =  webix.ui({
        rows: [
             main_toolbar,
            {
                id:'cols',
                cols:[
                    left_sidebar,
                    collection_multiview
                ]
            }
        ]
    })
    if(localStorage.getItem('jwt')){
        (
            async ()=>{
                let ADMIN = 1;
                let REGISTERED = 2;
                let result = await userApi.getByToken(localStorage.getItem('jwt'))
                if(result.status!==403){
                    let user = await result.json();
                    if(user.UserRoleId===ADMIN){
                        alert("ADMIN")
                    }
                    if(user.UserRoleId===REGISTERED){
                        action.afterUserLogin();
                    }
                }
            }
        )()
    }
})