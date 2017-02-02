import dispatcher from '../dispatcher';
import ajax from '../../helpers/ajax.js';

export function getUser(type) {

    ajax.getUser().then((user) => {
        // console.log('Login status', status);

        dispatcher.dispatch({
            type: 'FETCH_USER',
            user: user
        });
    })
        .catch((err) => {
            dispatcher.dispatch({ type: 'ERROR_STATUS', error: err });
        });
}

export function register(formData) {
    ajax.register(formData).then((data) => {

        dispatcher.dispatch({
            type: 'LOGIN',
            data
        });
    });
}

export function logIn(formData) {
    ajax.logIn(formData).then((data) => {

        dispatcher.dispatch({
            type: 'LOGIN',
            data
        });
    });
}

export function logInWithToken(token) {
    ajax.logInWithToken(token).then((data) => {

        dispatcher.dispatch({
            type: 'LOGIN',
            data
        });
    });
}

export function logOut() {
    ajax.logOut().then(() => {
        dispatcher.dispatch({
            type: 'LOGOUT',
            user: false
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

export function addPet(newPet) {
    // console.log('Adding new pet', newPet);

    ajax.addPet({ pet: newPet }).then((pet) => {
        if(!pet.error) {
            this.getPets();
        } else {
            dispatcher.dispatch({
                type: 'FORM_ERROR',
                errors: pet.error
            });
        }
        
    });
}

export function removePet(id) {

    // console.log('hit delete action', id);
    
    ajax.removePet(id).then((pet) => {

        if(!pet.error) {
            this.getPets();
        } else {
            dispatcher.dispatch({
                type: 'FORM_ERROR',
                errors: pet.error
            });
        }
        
    });
}

export function storePet(pet) {
    dispatcher.dispatch({
        type: 'STORE_CHOSEN_PET',
        chosenPet: pet
    });
}