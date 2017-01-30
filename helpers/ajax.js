var axios = require('axios');

module.exports = {
    checkLogin: function() {
        return axios.get('/account/status').then(function(res) {
            return res.data;
        })
        .catch(function (err) {
            console.log('Axios error', err);
        });
    },
    logout: function() {
        return axios.get('/account/logout').then(function(res) {
            return res.data;
        })
        .catch(function (err) {
            console.log(err);
        });
    },
    getPets: function() {
        return axios.get('/account/pets').then(function(res) {
            return res.data;
        })
        .catch(function (err) {
            console.log(err);
        });
    },
    addPet: function(pet) {
        return axios.post('/pets/save', pet).then(function(res) {
            return res.data;
        })
        .catch(function (err) {
            console.log(err);
        });
    }
}