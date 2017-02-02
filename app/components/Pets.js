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
        UserActions.storePet({
            id: this.props.user.username + '-' + this.props.index,
            pet: this.props.userPet
        });
    }

    render() {

        return (
          <li className="pet">
            <h4>{this.props.userPet.name}</h4>
            <ul>
                <li><strong>Level: 1</strong></li>
                <li>Type: {this.props.userPet.Pet.type1}</li>
                <li>Moves: {this.props.userPet.userMove1.name}, {this.props.userPet.userMove2.name}, {this.props.userPet.userMove3.name}, {this.props.userPet.userMove4.name}</li>
            </ul>
            <Link to={"aframe/" + this.props.index} onClick={this.storePetObj.bind(this)}><Button bsStyle="primary">Battle!</Button></Link>
            <Button bsStyle="danger" onClick={this.props.removePet}>Remove Pet</Button>
          </li>  
        );
    }
}