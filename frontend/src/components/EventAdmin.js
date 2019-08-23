import React, { useState } from 'react';
import MainHeader from './shared/MainHeader';
import ParticipantTable from './shared/ParticipantTable';
import EventContract from './shared/EventContract';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import connector from '../util/connector';
import Abi from '../contracts/abi';
import { withRouter } from 'react-router';
import moment from 'moment';

const BASE_URL = 'http://localhost:8000/api';


function EventAdmin(props) {
    const [tab, setTab] = useState("3");
    const [contract, setContract] = useState(null);
    const [event, setEvent] = useState({
        name: '-',
        address: '-',
        quota:0
    });
    const [participants, setParticipants] = useState([]);
   

    const [isLoaded, setLoaded] = useState(false);
    
    if(isLoaded==false){
        
        init();
        setLoaded(true);
    }

    async function getFromDB(publicAddress) {
        const response = await fetch(`${BASE_URL}/events/item/${publicAddress}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        });

        return response.json();
    }

    
    async function init(){
        let address = props.match.params.id;//props.match.params.id;
        let web3Instance
        try{
            web3Instance = await connector.getWeb3(window);
          }catch(err){
            window.alert(err);
            return;
        }

        let abi = Abi;

        // Retrieve the byte code
        const coinbase = await web3Instance.eth.getCoinbase();

        let myContractInstance = new web3Instance.eth.Contract(abi,address,{from:coinbase});
        setContract(myContractInstance);
     
        let eventName = await myContractInstance.methods.eventName().call();
        let eventAddress = await myContractInstance.methods.eventAddress().call();
        let rewards = await myContractInstance.methods.rewards().call();
        let quota = await myContractInstance.methods.quota.call();
        let status = await myContractInstance.methods.status().call();

        console.log(quota);
        // override data
        quota = 0;
        eventName = "-";
        eventAddress = "-";

        let localData = await getFromDB(props.match.params.id);

        setEvent({
            name: localData.name,
            address: localData.physicalAddress,
            rewards:`${rewards[0]} ${rewards[1]}`,
            startDate: localData.startDate,
            endDate: localData.endDate,
            quota: quota,
            status:status,
        })

        let participantsAddress = await myContractInstance.methods.getParticipants().call();
       
        let workers=[];
        participantsAddress.forEach(item => {
            workers.push(myContractInstance.methods.getUser(item).call());
        });

        Promise.all(workers).then(results=>{
            let participants=[];
           results.forEach((items,index)=>{
               participants.push({
                   address:participantsAddress[index],
                   email:items[0],
                   name:items[1],
                   checkIn:items[2]==true?'Yes':'No',
               })
           })
           setParticipants(participants);
        });

        // let participants = await myContractInstance.methods.getParticipants().call();
        // console.log(participants);
        
     
       
    }

    return (
        <div>
            <MainHeader />
            <div className="content-w">

                <div className="content-i">
                    <div className="content-box">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="element-wrapper">
                                    <h6 className="element-header">View Event</h6>
                                    <br />
                                    <div className="element-box">
                                        <Nav tabs>
                                            <NavItem>
                                                <NavLink onClick={() => setTab("1")} className={classnames({ active: tab === "1" })}>
                                                    Event Details
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink onClick={() => setTab("2")} className={classnames({ active: tab === "2" })}>
                                                    Participants
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink onClick={() => setTab("3")} className={classnames({ active: tab === "3" })}>
                                                    Smart Contract
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                        <br />
                                        <TabContent activeTab={tab}>
                                            <TabPane tabId="1">
                                                <div className="form">
                                                    <div className="form-group row">
                                                        <label className="control-label bold col-2">Event Name</label>
                                                        <label className="control-label col-6">{event.name}</label>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="control-label bold col-2">Where</label>
                                                        <label className="control-label col-6">{event.address}</label>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="control-label bold col-2">When</label>
                                                        <label className="control-label col-6">
                                                            { moment(event.startDate).format('LLL') } - { moment(event.endDate).format('LLL') }
                                                </label>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="control-label bold col-2">RSVP</label>
                                                        <label className="control-label bold col-6">
                                                           Free
                                                </label>
                                                    </div>
                                                </div>
                                            </TabPane>
                                            <TabPane tabId="2">
                                                <ParticipantTable eventId={event.id} participants={participants} contract={contract} />
                                            </TabPane>
                                            <TabPane tabId="3">
                                                <EventContract eventId={event.id} limit={event.quota} status={event.status} contract={contract} />
                                            </TabPane>
                                        </TabContent>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default withRouter(EventAdmin);