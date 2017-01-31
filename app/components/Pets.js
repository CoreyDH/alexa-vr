import React from 'react';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';

function getUserAccount() {
    return axios.get('/account')
}

export default class Pets extends React.Component {
    render() {
        return (
          <li className="pet">
            {this.props.userPet.name} - <Link to="aframe" userPet={this.props.userPet}>Battle!</Link>
          </li>  
        );
    }
}