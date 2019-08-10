import React, { useState } from 'react';
import MainHeader from './shared/MainHeader';
import classnames from 'classnames';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { withRouter } from 'react-router';
import Abi from '../contracts/abi';
import connector from '../util/connector';
import {useGlobalState} from '../util/state';



function ViewEvent(props) {

    const [event, setEvent] = useState({
        name: '-',
        address: 'Gambir, Central Jakarta City, Jakarta',
        rewards:'-',
        status:0,
    });

    const [isLoaded, setLoaded] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [web3, setWeb3] = useState(null);
    const [myContract, setMyContract] = useState(null);
    const [isRegister, setIsRegister] = useState(null);
    const [owner, setOwner] = useState(false);

    const [name] = useGlobalState('name');
    const [email] = useGlobalState('email');
   
    if(isLoaded==false){
        init();
        setLoaded(true);
    }

    async function init(){

        let address = '0x892827bb60a0a29e9e2a1deda93ad2ce27da86f3';//props.match.params.id; // 0x892827bb60a0a29e9e2a1deda93ad2ce27da86f3

        let web3Instance
        try{
            web3Instance = await connector.getWeb3(window);
            setWeb3(web3Instance);
        }catch(err){
            window.alert(err);
            return;
        }

        let abi = Abi;

        // Retrieve the byte code
        const coinbase = await web3Instance.eth.getCoinbase();

        let myContractInstance = new web3Instance.eth.Contract(abi,address,{from:coinbase});
        setMyContract(myContractInstance);

        //let register = await myContract.methods.register('andika','andika').send();
        let eventName = await myContractInstance.methods.eventName.call();
        let eventAddress = await myContractInstance.methods.eventAddress.call();
        let rewards = await myContractInstance.methods.rewards().call();
        if(rewards==null){
            rewards=[0,0,'-'];
        }
        let status = await myContractInstance.methods.status.call();
        let isRegister = await myContractInstance.methods.isRegister(coinbase).call();
        setIsRegister(isRegister);

        setEvent({
            name:eventName,
            address:eventAddress,
            rewards:`${rewards[0]/(10**rewards[1])} ${rewards[2]}`,
            status:status
        })

        let owner = await myContractInstance.methods.isOwner.call();
        setOwner(owner);

    
        let participantsAddress = await myContractInstance.methods.getParticipants().call();
        if(participantsAddress==null){
            participantsAddress=[];
        }
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

        
    }

    const [tab, setTab] = useState("1");

    const navigate = (path) => {
        props.history.push(path)
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
                                    <div className="element-box">
                                        <h3 className="text-center">{event.name}</h3>
                                        <br />

                                        <Nav tabs>
                                            <NavItem>
                                                <NavLink onClick={() => setTab("1")} className={classnames({ active: tab === "1" })}>
                                                    Event Details
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink onClick={() => setTab("2")} className={classnames({ active: tab === "2" })}>
                                                    Rules
                                                </NavLink>
                                            </NavItem>
                                            {owner &&
                                                <NavItem>
                                                    <NavLink onClick={() => setTab("3")} className={classnames({ active: tab === "3" })}>
                                                        Admin Panel
                                                    </NavLink>
                                                </NavItem>
                                            }
                                        </Nav>
                                        <br />
                                        <TabContent activeTab={tab}>
                                            <TabPane tabId="1">
                                                <div className="form">
                                                    <div className="form-group row">
                                                        <label className="control-label bold col-2">Where</label>
                                                        <label className="control-label col-6">{event.address}</label>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="control-label bold col-2">When</label>
                                                        <label className="control-label col-6">
                                                            Sun, Aug 11 02.00 PM - Sun, Aug 11 06.00 PM
                                                </label>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="control-label bold col-2">Rewards</label>
                                                        <label className="control-label bold col-6">
                                                            {event.rewards}
                                                        </label>
                                                    </div>

                                                    <div className="form-group row">
                                                        <label className="control-label bold col-2">RSVP</label>
                                                        {event.status==0&&
                                                            <label className="control-label bold col-6">
                                                                Free (waiting admin open event)
                                                            </label>
                                                        }
                                                        {event.status==1&& isRegister==false &&
                                                            <label className="control-label bold col-6">
                                                              <button onClick={() =>{
                                                                       register();
                                                                }}class="btn btn-primary">Rsvp</button>
                                                            </label>
                                                        }

                                                        {event.status==1&& isRegister==true &&
                                                            <label className="control-label bold col-6">
                                                              Already Register
                                                            </label>
                                                        }
                                                        {event.status==2&&
                                                            <label className="control-label bold col-6">
                                                               Close
                                                            </label>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="control-label bold col-2">Participants : </label>
                                                  
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th>Check In</th>
                                                                <th>Name</th>
                                                                <th>Email</th>
                                                                <th>Address</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {participants.map((item, index) => {
                                                                return <tr key={index}>
                                                                     <td >{item.checkIn}</td>
                                                                     <td >{item.name}</td>
                                                                     <td >{item.email}</td>
                                                                     <td>{item.address}</td>
                                                                </tr>
                                                               
                                                            })}
                                                        </tbody>
                                                    </table>

                                                </div>
                                            </TabPane>
                                            <TabPane tabId="2">
                                                <ul>
                                                    <li>Every one commits a small amount of ETH when they RSVP</li>
                                                    <li>any no show will lose their ETH, and will be <span className="bold">split amongs attendees</span></li>
                                                    <li>After event you can withfraw your post-event payout</li>
                                                </ul>

                                                <p>Please remember</p>
                                                <ul>
                                                    <li>Once you RSVP you cannot cancel</li>
                                                    <li>the event organizer musk mark you as attended in order to qualify the payout</li>
                                                    <li>You must withdraw your payout within post-event cooling period</li>
                                                </ul>

                                                <p>for more detail see <a href="https://www.google.com" target="_blank">terms and conditions</a></p>
                                            </TabPane>
                                            <TabPane tabId="3">
                                                <button onClick={() => navigate('/admin/event/'+props.match.params.id)} className="btn btn-primary">Open Admin</button>
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
    );

    async function register(){
        let result = await myContract.methods.register("-","-").send();
        console.log(result);

    }
}

export default withRouter(ViewEvent);