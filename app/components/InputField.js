import React from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

export default class InputField extends React.Component {

    render() {
        return (
            <FormGroup controlId={this.props.name}>
                <ControlLabel>{this.props.label}: </ControlLabel>
                <FormControl type={this.props.type} name={this.props.name} placeholder={this.props.placeholder}></FormControl>
            </FormGroup>
        );
    }
}