var axios = require('axios');

module.exports = {
    checkLogin: function() {
        return axios.get('/account/status').then(function(res) {
            return res.data;
        })
        .catch(function (err) {
            console.log('Error checking user session', err);
        });
    },
    logout: function() {
        return axios.get('/account/logout').then(function(res) {
            return res.data;
        })
        .catch(function (err) {
            console.log('Error logging out', err);
        });
    },
    getPets: function() {
        return axios.get('/account/pets').then(function(res) {
            return res.data;
        })
        .catch(function (err) {
            console.log('Error retrieving user\'s pets', err);
        });
    },
    addPet: function(pet) {
        return axios.post('/account/pets', pet).then(function(res) {
            return res.data;
        })
        .catch(function (err) {
            console.log('Error adding pet to user collection', err);
        });
    }
}