var axios = require('axios');

module.exports = {
    getUser: function() {
        return axios.get('/account/user').then(function(res) {
            return res.data;
        })
        .catch(function (err) {
            console.log('Error checking user session', err);
        });
    },
    register: function(formData) {
        return axios.post('/account/register', formData).then(function(res) {
            return res.data;
        })
        .catch(function (err) {
            console.log('Registering', err);
        });
    },
    logIn: function(formData) {
        return axios.post('/account/login', formData).then(function(res) {
            return res.data;
        })
        .catch(function (err) {
            console.log('Error logging out', err);
        });
    },
    logOut: function() {
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