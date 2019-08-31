import Context from './context';
import React from 'react';

export const IsLogged = (props) => (
    <Context.Consumer>
        {value => {
            console.log(value, props);
            if (value.address.length !== 0) {
                return props.children
            } else if (props.loggedAddress) {
                value.setAddress(props.loggedAddress);    
                return null;
            } else {
                return null;
            }
        }}
    </Context.Consumer>
);

export const IsNotLogged = (props) => (
    <Context.Consumer>
        {value => {
            if (value.address.length === 0) {
                return props.children
            } else {
                return null;
            }
        }}
    </Context.Consumer>
);