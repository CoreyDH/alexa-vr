import React from 'react';

function getUserAccount() {
    return axios.get('/account')
}

export default class Pets extends React.Component {
    render() {
        return (
          <div className="pet-holder">

          </div>  
        );
    }
}