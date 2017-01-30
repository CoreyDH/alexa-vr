import React from 'react';
import { Button } from 'react-bootstrap';

import * as UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';

import Pets from '../components/Pets';

export default class Account extends React.Component {

    constructor() {
        super();

        this.getPets = this.getPets.bind(this);
        this.state = {
            userPets: UserActions.getPets()
        }
    }

    componentWillMount() {
        UserStore.on('petChange', this.getPets);
    }

    componentWillUnmount() {
        UserStore.removeListener('petChange', this.getPets)
    }

    getPets() {

        console.log('emitted change received for pets');
        this.setState({
            userPets: UserStore.getPets()
        });
    }

    addPet() {
        UserActions.addPet();
    }

    render() {

        const displayPets = Array.isArray(this.state.userPets) ? (this.state.userPets.length > 0 ? true : false) : false;
        let petHTML = '';

        console.log('user pets: ', this.state.userPets, 'display?', displayPets);



        if (displayPets) {

            let PetList = this.state.userPets.map((pet, i) => <Pets key={i} userPet={pet} />);

            petHTML = (
                <ul className="user-pet-holder">
                    {PetList}
                </ul>
            )

        } else {
            petHTML = (
                <div className="user-pet-holder">
                    No pets found! <br /><br />
                    <Button onClick={this.addPet.bind(this)}>Add Pet Alexa</Button>
                </div>
            );
        }

        return (
            <div>
                {petHTML}
            </div>
        );
    }
}