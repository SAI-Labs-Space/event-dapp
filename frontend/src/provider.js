import Context from './context';
import React from 'react';

class Provider extends React.Component {
    state = {
        address: ''
    };

    render() {
        return (
            <Context.Provider
                value={{
                    address: this.state.address,
                    setAddress: (address) => {
                        this.setState({ address })
                    }
                }}
            >
                {this.props.children}
            </Context.Provider>
        );
    }
}

export default Provider;