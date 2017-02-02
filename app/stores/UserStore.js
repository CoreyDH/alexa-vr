import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';


class UserStore extends EventEmitter {
    constructor() {
        super();

        this.user = false;
        this.userPets = [];
        this.chosenPet = [];
        this.formErrors = null;
    }

    getUser() {
        return this.user;
    }

    getPets() {
        return this.userPets;
    }

    getUserPetIndex(id, arr) {

        let arrayIndex = null;

        arr.forEach((el, i) => {
            if(el.id === id) {
                arrayIndex = i;
            }
        });

        return arrayIndex;
    }

    getChosenPet(id) {
        return this.chosenPet.filter((el) => { return el.id === id; });
    }

    isAuthenticated() {
        return sessionStorage.getItem('token') !== null && this.user;
    }

    getToken() {
        return sessionStorage.getItem('token');
    }

    setToken(token) {
        sessionStorage.setItem('token', token);
    }

    destroyToken() {
        sessionStorage.removeItem('token');
    }

    getFormErrors() {
        return this.formErrors;
    }

    handleActions(action) {
        // console.log('UserStore received an action', action);

        switch (action.type) {
            case 'LOGIN':

                if (action.data.success && action.data.user) {
                    this.setToken(action.data.token);
                    this.user = action.data.user;
                    this.emit('session');
                } else {
                    this.formErrors = action.data.errors;
                    this.emit('formError');
                }
                break;
                
            case 'LOGOUT':
                this.destroyToken();
                this.user = action.user
                this.emit('session');
                break;

            case 'FETCH_USER':
                this.user = action.user;
                this.emit('getUser');
                break;

            case 'SHOW_PETS':
                this.userPets = action.userPets;
                this.emit('petChange');
                break;

            case 'FORM_ERROR':
                this.formErrors = {
                    errors: action.errors
                }
                this.emit('formError');
                break;

            case 'REMOVE_PET':
                const petIndex = this.getUserPetIndex(action.id, this.userPets);
                this.userPets.splice(petIndex, 1);
                this.emit('petChange');
                break;

            case 'STORE_CHOSEN_PET':
                this.chosenPet.push(action.chosenPet);
                this.emit('chosenPet');
                break;
        }
    }
}

const userStore = new UserStore;
dispatcher.register(userStore.handleActions.bind(userStore));

export default userStore;