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

    removePet() {
        UserActions.removePet(this.props.userPet.id);
    }

    render() {

        return (
            <li className="pet-card">
                <h3 className="pet-name">{this.props.userPet.name}</h3>
                <ul className="pet-stats">
                    <li className="pet-level"><strong>Level: 1</strong></li>
                    <li className="pet-class">Pet: {this.props.userPet.Pet.name}</li>
                    <li className="pet-type">Type: {this.props.userPet.Pet.type1}</li>
                    <li className="pet-moves">Moves: {this.props.userPet.userMove1.name}, {this.props.userPet.userMove2.name}, {this.props.userPet.userMove3.name}, {this.props.userPet.userMove4.name}</li>
                </ul>
                <div className="pet-options">
                    <Link to={"aframe/"+ this.props.userPet.id } onClick={this.storePetObj.bind(this)}><Button className="pet-battle" bsStyle="primary">Battle!</Button></Link>
                    <Button bsStyle="danger" className="pull-right" onClick={this.removePet.bind(this)}>Delete Pet</Button> 
                </div>
            </li>
        );
    }
}