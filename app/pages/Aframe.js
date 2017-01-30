import React from 'react';

export default class Aframe extends React.Component {
    render() {
        return (
            <div className="col-xs-12">
                Aframe battle. {this.props.userPet.name}
            </div>
        );
    }
}