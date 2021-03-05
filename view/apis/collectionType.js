exports.get = async function get(data) {
    return await fetch('/collectionType/'+data, {
        method: 'GET',
        headers:
            {
                'Content-Type': 'application/json'
            }
    })
}