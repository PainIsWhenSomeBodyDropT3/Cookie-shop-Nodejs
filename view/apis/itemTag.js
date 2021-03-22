const fetch = require('node-fetch');
exports.create = async function create(data) {
    return await fetch('/itemTag/create', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    })
}