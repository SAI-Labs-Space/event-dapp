import React from 'react';
import MainHeader from './shared/MainHeader';
import { withRouter } from 'react-router';
import { IsLogged } from '../consumer';

const BASE_URL='http://localhost:8000/api';

class MainPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            events: []
        };
        this.listEvents();
    }

    navigate(path) {
        this.props.history.push(path)
        console.log(this.props)
    }

    listEvents(){

        fetch(`${BASE_URL}/events`, {headers: {
              'Content-Type': 'application/json'
            },
          }).then(response => response.json())
          .then(res=>{
              this.setState({events:res})
          })
          .catch(err=>console.log(err))

    }
    
    render() {
        return (
            <div>
                <MainHeader />

                <div className="content-w">

                    <div className="content-i">
                        <div className="content-box">
                            <div className="row">
                                <div className="col-6">
                                    <div className="element-wrapper">
                                        <h6 className="element-header">Events</h6>
                                        <br />
                                        {this.state.events.map((value, index) => {
                                            return <div key={index} className="element-box">
                                                        <h5 className="can-click" onClick={() => this.navigate('/event/'+value.publicAddress)}>{value.name}</h5>
                                                        <p className="text-muted">{value.location}</p>
                                                        <p >{value.description}</p>
                                                        <br />
                                                        <p>{value.quota} Seats</p>
                                                    </div>
                                        })}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <img src="https://cdn.dribbble.com/users/1312159/screenshots/3499807/design-drinks.png" className="img-fluid"/>
                                    <br /><br />
                                    <IsLogged>
                                        <button onClick={() => this.navigate('/create-event')} href="/create-event" className="btn btn-primary">
                                            Create My Event
                                        </button>
                                    </IsLogged>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(MainPage);