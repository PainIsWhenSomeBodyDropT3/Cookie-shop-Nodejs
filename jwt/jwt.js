const jwt = require('jsonwebtoken')
let ADMIN = 1
let REGISTERED_USER = 2
exports.verifyToken = function (req, res, next) {
    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        req.token = bearer[1]
        next();
    } else {
        res.sendStatus(403)
    }
}
exports.verifyAdmin = function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, data) => {
        if (err) {
            res.sendStatus(403)
        } else {
            if (data.UserRoleId === ADMIN) {
                req.admin = data
                next()
            } else {
                res.sendStatus(403)
            }
        }
    })
}