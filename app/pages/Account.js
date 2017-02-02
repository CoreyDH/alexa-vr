import React from 'react';
import { hashHistory } from 'react-router';
import { Button, Form, FormGroup, FormControl } from 'react-bootstrap';

import * as UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';

import Pets from '../components/Pets';

export default class Account extends React.Component {

    constructor() {
        super();

        this.redirectAccount();

        this.state = {
            userPets: false,
            addPet: {
                name: null,
                type: 'Alexa'
            }
        }

        this.getPets = this.getPets.bind(this);

        // console.log('state for account', this.state);
    }

    componentWillMount() {
        UserStore.on('petChange', this.getPets);
        UserStore.on('session', this.redirectAccount);
        UserActions.getPets();
    }

    componentWillUnmount() {
        UserStore.removeListener('petChange', this.getPets);
        UserStore.removeListener('session', this.redirectAccount);
    }

    redirectAccount() {
        if(!UserStore.isAuthenticated()) {
            hashHistory.push('/login');
        }
    }

    getPets() {
        // console.log('emitted change received for pets');
        this.setState({
            userPets: UserStore.getPets()
        });
    }

    handleChange(event) {
        this.setState({ 
            addPet: {
                name: event.target.value,
                type: 'Alexa'
            } 
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        UserActions.addPet(this.state.addPet);
    }


    render() {
        const { userPets } = this.state;

        const displayPets = Array.isArray(userPets) ? (userPets.length > 0 ? true : false) : false;
        let petHTML = '';

        // console.log('user pets: ', userPets, 'display?', displayPets);
        if (displayPets) {

            const PetList = userPets.map((pet, i) => <Pets key={i} index={i} user={this.state.authenticated} userPet={pet} />);

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
            <div className="col-xs-12">
                <div className="user-pet-holder col-xs-12 col-sm-8">
                    {petHTML}
                </div>
                <div className="user-pet-addPet col-xs-4 col-sm-4">
                    <Form inline onSubmit={this.handleSubmit.bind(this)}>
                        <FormGroup controlId="formInlineName">
                            <FormControl type="text" defaultValue={this.state.addPet.name} onChange={this.handleChange.bind(this)} placeholder="Enter Pet Name Here" />
                        </FormGroup>
                        <Button bsStyle="success" type="submit">Add New Pet</Button>
                    </Form>
                </div>
            </div>
        );
    }
}