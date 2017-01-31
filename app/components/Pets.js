import React from 'react';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';

import * as UserActions from '../actions/UserActions';
import UserStore from "../stores/UserStore";

export default class Pets extends React.Component {

    constructor() {
        super();
    }

    storePetObj() {
        UserAction.addPet(this.state.petObj);
    }

    createPetObj() {
        console.log('Pets props', this.props);
        this.setState({
            id: this.props.account.login.username + '-' + this.props.key,
            chosenPet: this.props.userPet
        });
    }

    render() {
        
        this.createPetObj();

        return (
          <li className="pet">
            <h4>{this.props.userPet.name}</h4>
            <ul>
                <li>Type: {this.props.userPet.Pet.type1}</li>
                <li>Moves: {this.props.userPet.userMove1.name}, {this.props.userPet.userMove2.name}, {this.props.userPet.userMove3.name}, {this.props.userPet.userMove4.name}</li>
            </ul>
            <Link to={"aframe/" + this.state.petObj.id} onClick={storePetObj}>Battle!</Link>
          </li>  
        );
    }
}