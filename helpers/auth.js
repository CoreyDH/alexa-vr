const jwt = require('jsonwebtoken');

module.exports = {
    generateToken: function (user) {
        //1. Dont use password and other sensitive fields
        //2. Use fields that are useful in other parts of the     
        //app/collections/models
        var u = {
            username: user.username,
            email: user.email,
            id: user.id.toString(),
        };
        return token = jwt.sign(u, 'secret', {
            expiresIn: 60 * 60 * 24 // expires in 24 hours
        });
    }
}