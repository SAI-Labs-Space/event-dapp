import React, { useState, useEffect } from 'react';
import ParticipantRow from './ParticipantRow';
import BlockchainProcessIndicator from './BlockchainProcessIndicator';
import ConditionalRender from './ConditionalRender';
import LoadingText from './LoadingText';

function ParticipantTable(props) {

    const [participants, setParticipants] = useState([]);
    const [contract, setContract] = useState(null);
    const [indicator, setIndicator] = useState(0);

    useEffect(() => {
        if (props.participants) {
            setParticipants(props.participants)
        }
        if (props.contract) {
            setContract(props.contract);
        }

    });
    async function callback(address, index) {
        let status = await contract.methods.checkIn(address).send()
            .on('transactionHash', (transactionHash) => {
                console.log(transactionHash);
                setIndicator(1);
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                console.log(confirmationNumber)
                console.log(receipt)
                if (confirmationNumber >= 4) {
                    setIndicator(2);
                    setTimeout(() => {
                        setIndicator(0);
                    }, 2000);
                    props.reloadEvent();
                }
            });
        console.log(status);
    }
    return (
        <div>
            <BlockchainProcessIndicator status={indicator} />
            <br />
            <ConditionalRender when={props && props.fetched}>
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
                            return <ParticipantRow disabled={indicator !== 0} index={index} item={item} callback={callback} />
                        })}

                    </tbody>
                </table>
            </ConditionalRender>
            <ConditionalRender when={props && !props.fetched}>
                <LoadingText />
            </ConditionalRender>            
        </div>
    );
}

export default ParticipantTable;