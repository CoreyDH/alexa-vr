import React from 'react';
import { hashHistory } from 'react-router';
import { Button } from 'react-bootstrap';

import * as UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';

import Pets from '../components/Pets';

export default class Account extends React.Component {

    constructor() {
        super();

        this.state = {
            userPets: {
                error: null
            }
        }

        this.getPets = this.getPets.bind(this);

        console.log('state for account', this.state);
    }

    componentWillMount() {
        UserStore.on('petChange', this.getPets);
        UserActions.getPets();
    }

    componentWillUnmount() {
        UserStore.removeListener('petChange', this.getPets);
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

        // if(!this.state.loggedIn) {
        //     hashHistory.push('/login');
        // }

        const displayPets = Array.isArray(this.state.userPets) ? (this.state.userPets.length > 0 ? true : false) : false;
        let petHTML = '';

        console.log('user pets: ', this.state.userPets, 'display?', displayPets);
        if (displayPets) {

            const PetList = this.state.userPets.map((pet, i) => <Pets key={i} index={i} userPet={pet} />);

            petHTML = (
                <ul>
                    {PetList}
                </ul>
            );

        } else {
            petHTML = (
                    <span>No pets found!</span>
            );
        }

        return (
            <div className="user-pet-holder">
                <div className="col-xs-12 col-sm-9">
                    {petHTML}
                </div>
                <div className="col-xs-12 col-sm-3">
                    <p>{this.state.userPets.error}</p>
                    <Button bsStyle="success" onClick={this.addPet.bind(this)}>Add New Pet</Button>
                </div>
            </div>
        );
    }
}