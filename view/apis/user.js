const fetch = require('node-fetch');
exports.isUserRegistered = async function isUserRegistered(data) {
    return await fetch('/user/isRegister', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    })
}
exports.registerUser = async function registerUser(data) {
    return await fetch('/user/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    })
}

exports.loginUser = async function loginUser(data) {
    return await fetch('/user/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    })
}

exports.getByToken = async function getByToken(data) {
    return await fetch('/user/getByToken', {
        method: 'POST',
        headers:
            {'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + data}
    })
}