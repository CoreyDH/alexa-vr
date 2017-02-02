const jwt = require('jsonwebtoken');

module.exports = {
    generateToken: function (user) {
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