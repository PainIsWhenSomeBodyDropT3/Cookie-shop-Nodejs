let user_api = require('../apis/user')
let socket = new WebSocket('ws://localhost:5000/broadcast');


let CREATE_COLLECTION = 'create_collection'
let UPDATE_COLLECTION = 'update_collection'
let DELETE_COLLECTION = 'delete_collection'
let USER_COLLECTION = 'user_'

let CREATE_ITEM = 'create_item'
let DELETE_ITEM = 'delete_item'

let DELETE_USER = 'delete_user'

let collection_map = new Map()
collection_map.set(1, "books");
collection_map.set(2, "drinks");
collection_map.set(3, "games");
collection_map.set(4, "others");


socket.onmessage = (msg) => {
    msg = JSON.parse(msg.data)
    let collection = msg.collection ? msg.collection : '';
    let item = msg.item ? msg.item : ''
    let userId = msg.userId ? msg.userId : -1
    switch (msg.action) {
        case CREATE_COLLECTION: {
            $$(collection_map.get(collection.CollectionTypeId)).add(collection, 0);
            (
                async () => {
                    let user_response = await user_api.getByToken(localStorage.getItem('jwt'))
                    if (user_response.status !== 403) {
                        let user = await user_response.json();
                        if (user.Id === collection.UserId) {
                            $$(USER_COLLECTION + collection_map.get(collection.CollectionTypeId)).add(collection, 0);
                        }
                    }
                }
            )()
            break
        }
        case UPDATE_COLLECTION: {

            let data = $$(USER_COLLECTION + collection_map.get(collection.CollectionTypeId))
            let elements = data.serialize();

            for (let i = 0; i < elements.length; i++) {
                if (elements[i].Id === collection.Id) {
                    data.updateItem(data.getIdByIndex(i), collection);
                }
            }

            data = $$(collection_map.get(collection.CollectionTypeId))
            elements = data.serialize();
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].Id === collection.Id) {
                    data.updateItem(data.getIdByIndex(i), collection);
                }
            }
            break
        }
        case DELETE_COLLECTION: {

            let data = $$(USER_COLLECTION + collection_map.get(collection.CollectionTypeId))
            let elements = data.serialize();

            for (let i = 0; i < elements.length; i++) {
                if (elements[i].Id === collection.Id) {
                    data.remove(data.getIdByIndex(i));
                }
            }

            data = $$(collection_map.get(collection.CollectionTypeId))
            elements = data.serialize();
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].Id === collection.Id) {
                    data.remove(data.getIdByIndex(i));
                }
            }
            break
        }
        case CREATE_ITEM : {
            console.log('CREATE_ITEM')
            $$('users_board').add(item, $$('my_board').getIndexById(item.id));
            break
        }
        case DELETE_ITEM : {
            console.log('DELETE_ITEM')
            $$('users_board').remove(item.itemId);
            $$('users_board').refresh()
            break
        }
        case DELETE_USER : {
            (
                async () => {

                    let result = await user_api.getByToken(localStorage.getItem('jwt'))
                    if (result.status === 403) {

                        alert('Welcome to the ban buddy')
                        location.reload()
                    }
                }
            )()
        }
    }
}

socket.onerror = (e) => {
    console.log('error ' + e.message)
}
socket.onclose = (msg) => {
    console.log('close ' + msg.code)
}

exports.socket = socket