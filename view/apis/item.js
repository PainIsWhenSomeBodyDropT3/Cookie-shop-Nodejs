const fetch = require('node-fetch');
exports.create = async function create(data) {
    return await fetch('/item/create', {
        method: 'POST',
        body: JSON.stringify(data),
        headers:
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
    })
}
exports.update = async function update(data) {
    return await fetch('/item/update', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers:
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
    })
}
exports.remove = async function remove(data) {
    return await fetch('/item/remove', {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers:
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
    })
}