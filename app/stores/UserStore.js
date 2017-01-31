import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';


class UserStore extends EventEmitter {
    constructor() {
        super();

        this.loggedIn = false;
        this.userPets = false;
        this.chosenPet = [];
    }

    isLoggedIn() {
        return this.loggedIn;
    }

    getPets() {
        return this.userPets;
    }

    getChosenPet(id) {
        return this.chosenPet.filter((el) => { return el.id === id; })[0];
    }

    handleActions(action) {
        console.log('UserStore received an action', action);

        switch (action.type) {
            case 'CHECK_STATUS':
                this.loggedIn = action.status;
                this.emit('change');
                break;
            case 'SHOW_PETS':
                this.userPets = action.userPets;
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