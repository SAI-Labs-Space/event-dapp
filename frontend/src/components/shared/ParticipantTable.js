import React, { useState,useEffect } from 'react';
import ParticipantRow from './ParticipantRow';
import { async } from 'q';


function ParticipantTable(props) {

    const [participants, setParticipants] = useState([]);
    const [contract, setContract] = useState(null);
   

    useEffect(() => {
        if(props.participants){
            setParticipants(props.participants)
        }
        if(props.contract){
            setContract(props.contract);
        }
        
    });
    async function callback(address,index){
        let status = await contract.methods.checkIn(address).send();
        console.log(status);
    }
    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {participants.map((item, index) => {
                    return <ParticipantRow index={index}  item={item} callback={callback}/>
                })}

                </tbody>
            </table>
        </div>
    );
}

export default ParticipantTable;