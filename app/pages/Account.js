import React from 'react';
import { hashHistory } from 'react-router';
import { Button, Form, FormGroup, FormControl } from 'react-bootstrap';

import * as UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';

import Pets from '../components/Pets';

export default class Account extends React.Component {

    constructor() {
        super();

        this.state = {
            userPets: UserActions.getPets(),
            authenticated: UserStore.isAuthenticated(),
            addPet: {
                name: null,
                type: 'Alexa'
            }
        }

        this.getPets = this.getPets.bind(this);

        console.log('state for account', this.state);
    }

    componentWillMount() {
        UserStore.on('petChange', this.getPets);
        UserStore.on('session', this.getPets);
        UserStore.getPets();
    }

    componentWillUnmount() {
        UserStore.removeListener('petChange', this.getPets);
        UserStore.removeListener('session', this.getPets);
    }

    redirectAccount() {
        this.setState({
            authenticated: UserStore.isAuthenticated()
        })
    }

    getPets() {
        console.log('emitted change received for pets');
        this.setState({
            userPets: UserStore.getPets()
        });
    }

    removePet(id) {
        UserActions.removePet(id);
    }

    handleChange(event) {
        let fieldName = event.target.name;
        let fleldVal = event.target.value;
        this.setState({ addPet: { ...this.state.addPet, [fieldName]: fleldVal } });
    }

    handleSubmit(event) {
        event.preventDefault();

        UserActions.addPet(this.state.addPet);
    }


    render() {

        if (!this.state.authenticated) {
            hashHistory.push('/login');
        }

        const { userPets } = this.state;

        console.log(userPets);

        const displayPets = Array.isArray(userPets) ? (userPets.length > 0 ? true : false) : false;
        let petHTML = '';

        console.log('user pets: ', userPets, 'display?', displayPets);
        if (displayPets) {

            const PetList = userPets.map((pet, i) => <Pets key={i} index={i} user={this.state.authenticated} userPet={pet} removePet={this.removePet.bind(this)} />);

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
                <div className="col-xs-12 col-sm-8">
                    {petHTML}
                </div>
                <div className="user-pet-addPet col-xs-4 col-sm-4">
                    <Form inline onSubmit={this.handleSubmit.bind(this)}>
                        <FormGroup controlId="formInlineName">
                            <FormControl type="text" value={this.state.addPet.name} onChange={this.handleChange.bind(this)} placeholder="Enter Pet Name Here" />
                        </FormGroup>
                        <Button bsStyle="success" type="submit">Add New Pet</Button>
                    </Form>
                </div>
            </div>
        );
    }
}