let webix = require('../../webix.trial.complete/webix/codebase/webix.js')
function collectionData(header, id,data, isCollapsed) {
    return {
        header: header,
        collapsed: isCollapsed,
        body: {
            rows: [
                {
                    view: 'dataview',
                    id: id,
                    url: function (){
                        $$(id).load(function(){
                           let result =  webix.ajax().headers({
                                'Authorization': 'Bearer ' + localStorage.getItem('jwt') // any custom headers can be defined in such a way
                            }).get(data);
                            if(result.status!==404){
                                return result;
                            }
                            else return ''
                        });

                    },
                    css:'collection_box',
                    item: {
                        height: 340,
                        width: 400
                    },
                    /*on: {
                        // the default click behavior that is true for any datatable cell
                        onItemDblClick: function (e, id, node) {
                            {
                                $$("my_popup").show();
                            }
                        }
                    },*/
                    template: `<div class='content'>

<img src="https://res.cloudinary.com/ivanverigo/image/upload/#PathToImg#" height="80%" width="100%" alt="No img"/>
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


var offers =  (header, id,data, isCollapsed)=> {
    return {
        view: 'accordion',
        type: 'space',
        rows: [
            collectionData(header, id, data, isCollapsed)
        ]
    };
}

var collection_multiview_data = [
    { id: 'book', rows: [offers('Books','books','/collection/BOOK',false)]},
    { id: 'drink', rows: [offers('Drink','drinks','/collection/DRINK',false)] },
    { id: 'game', rows: [offers('Games','games','/collection/GAME',false)] },
    { id: 'other', rows: [offers('Others','others','/collection/OTHER',false)] },
     { id: 'items', template: 'item_offers' },

    { id: 'user_book', rows: [offers('Books','user_books','/user/collection/BOOK',false)] },
    { id: 'user_drink', rows: [offers('Drinks','user_drinks','/user/collection/DRINK',false)] },
    { id: 'user_game', rows: [offers('Games','user_games','/user/collection/GAME',false)] },
    { id: 'user_other', rows: [offers('Others','user_others','/user/collection/OTHER',false)] },
    { id: 'user_items', template: 'item_user_offers' },
    { id: 'user_items_in_table', template: 'items_in_table' }
];







exports.collection_multiview_data=collection_multiview_data