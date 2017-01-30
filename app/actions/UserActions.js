import dispatcher from '../dispatcher';
import ajax from '../../helpers/ajax.js';

export function checkStatus(type) {
    dispatcher.dispatch({
        type: 'FETCH_STATUS'
    });

    ajax.checkLogin().then((status) => {
        console.log('Login status', status);

        dispatcher.dispatch({
            type: 'CHECK_STATUS',
            status: status
        });
    })
        .catch((err) => {
            dispatcher.dispatch({ type: 'ERROR_STATUS', error: err });
        });
}

export function logOut() {
    ajax.logout().then(() => {
        dispatcher.dispatch({
            type: 'CHECK_STATUS',
            status: false
        });
    });
}

export function getPets() {
    ajax.getPets().then((pets) => {

        dispatcher.dispatch({
            type: 'SHOW_PETS',
            userPets: pets
        });
    });
}

export function addPet(type) {
    ajax.addPet({ 
        pet: {
            name: 'Alexa'
        }
    }).then((pet) => {

        dispatcher.dispatch({
            type: 'SHOW_PETS',
            userPets: pet
        });
    });
}