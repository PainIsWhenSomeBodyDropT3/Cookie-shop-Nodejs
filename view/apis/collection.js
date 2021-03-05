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