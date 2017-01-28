import { EventEmitter } from 'events';
import ajax from '../../helpers/ajax.js';

class UserStore extends EventEmitter {
    constructor() {
        super();

        this.loggedIn = false;
        ajax.checkLogin().then((status) => {
            console.log('Login status', status);
            if(status) {
                this.loggedIn = status;
                this.emit('change');
            }
        });
        
    }

    isLoggedIn() {
        return this.loggedIn;
    }
}

const userStore = new UserStore;
export default userStore;