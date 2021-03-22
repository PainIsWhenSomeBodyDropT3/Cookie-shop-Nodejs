const fetch = require('node-fetch');
exports.isExist = async function isExist(data) {
    return await fetch('/collection/isExist', {
        method: 'POST',
        body: JSON.stringify(data),
        headers:
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
    })
}
exports.create = async function create(data) {
    return await fetch('/collection/create', {
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
    return await fetch('/collection/update', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers:
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
    })
}
exports.destroy = async function destroy(data) {
    return await fetch('/collection/destroy', {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers:
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
    })
}