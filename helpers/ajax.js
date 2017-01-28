var axios = require('axios');

module.exports = {
    checkLogin: function(callback) {
        return axios.get('/account/status').then(function(res) {
            return res;
        })
        .catch(function (err) {
            console.log('Axios error', err);
        });
    },
    logout: function() {
        axios.get('/account/logout').then(function(res) {
            if(res.data) {
                callback(res.data);
            } else {
                callback(false);
            }
        })
        .catch(function (err) {
            console.log(err);
        });
    }
}