import React, { useState } from 'react';
import MainHeader from './shared/MainHeader';
import DatePicker from 'react-datepicker';
import Abi from '../contracts/abi';
import Bytecode from '../contracts/bytecode';
import connector from '../util/connector';

const BASE_URL='http://localhost:8000/api';

function CreateEvent() {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [quota, setQuota] = useState(10);
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());

    return (
        <div>
            <MainHeader />

            <div className="content-w">

                <div className="content-i">
                    <div className="content-box">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="element-wrapper">
                                    <h6 className="element-header">
                                        Create Event
                    </h6>
                                    <div className="element-box">
                                        <p className="event-banner text-muted">Create your event with us, increase the attendance rate and boost your engagement</p>
                                        <br />
                                        <div className="row">
                                            <div className="col-6">
                                                <img src="https://cdn.dribbble.com/users/1312159/screenshots/3499807/design-drinks.png" className="img-fluid" />
                                            </div>
                                            <div className="form col-6">
                                                <div className="form-group">
                                                    <label className="control-label">Event Name</label>
                                                    <input value={name} onChange={e => setName(e.target.value)} className="form-control" />
                                                </div>
                                                <div className="form-group">
                                                    <label className="control-label">Event Description</label>
                                                    <textarea rows="6" value={description} onChange={e => setDescription(e.target.value)} className="form-control" />
                                                </div>
                                                <div className="form-group">
                                                    <label className="control-label">Address Location</label>
                                                    <textarea rows="6" value={address} onChange={e => setAddress(e.target.value)} className="form-control" />
                                                </div>
                                                <div className="form-group">
                                                    <label className="control-label">Jumlah Peserta</label>
                                                    <input value={quota} type="number" onChange={e => setQuota(e.target.value)} className="form-control" />
                                                </div>
                                                <div className="col-12 row">
                                                    <div className="form-group">
                                                        <label className="control-label">Date Start</label>
                                                        <div className="col-12 row">
                                                            <DatePicker
                                                                selected={start}
                                                                onChange={setStart}
                                                                showTimeSelect
                                                                timeFormat="HH:mm"
                                                                timeIntervals={15}
                                                                dateFormat="MMMM d, yyyy h:mm aa"
                                                                timeCaption="time"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="control-label">Date End</label>
                                                        <div className="col-12 row">
                                                            <DatePicker
                                                                selected={end}
                                                                onChange={setEnd}
                                                                showTimeSelect
                                                                timeFormat="HH:mm"
                                                                timeIntervals={15}
                                                                dateFormat="MMMM d, yyyy h:mm aa"
                                                                timeCaption="time"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <br />
                                                <div className="form-group">
                                                    <button onClick={() =>{
                                                            createEvent();
                                                    }}class="btn btn-primary">Save</button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    async function createEvent(){
        // let startTime = start.getTime();
        // let endTime = start.getTime();
        // let web3;
        // try{
        //     web3 = await connector.getWeb3(window);
        // }catch(err){
        //     window.alert(err);
        //     return;
        // }

        // let abi = Abi;

        // // Retrieve the byte code
        // let bytecode = Bytecode['object'];
        
        // // https://github.com/ethereum/web3.js/issues/2837#issuecomment-498838831
        // let MyContract = new web3.eth.Contract(abi,undefined, {transactionConfirmationBlocks: 3});
        
        // const coinbase = await web3.eth.getCoinbase();

        // let result = await MyContract.deploy({
        //         data: '0x'+bytecode,
        //         arguments: ["0x6c1bfb2fb67dd71de2b9712f9025a4ddc578b06f", name,address,description,startTime,endTime,quota]
        //     }).send({
        //         from:coinbase
        //     });
        
        // loading after that redirect
        //console.log(result.options.address);
            
        // MyContract.deploy({
        //     data: '0x'+bytecode,
        //     arguments: ["0x6c1bfb2fb67dd71de2b9712f9025a4ddc578b06f", name,address,description,1,2,10]
        // }).send({
        //     from:coinbase
        // },(err,res)=>{
        //     console.log(err);
        //     console.log(res);
        // }).on('error', (error)=>{ console.log(error) })
        // .on('transactionHash', (transactionHash)=>{ console.log(transactionHash) })
        // .on('receipt', (receipt)=>{
        //    console.log(receipt.contractAddress) // contains the new contract address
        // })
        // .on('confirmation', (confirmationNumber, receipt)=>{
        //     console.log(confirmationNumber)
        //     console.log(receipt)
        //   })
        // .then((newContractInstance)=>{
        //     console.log(newContractInstance.options.address) // instance with the new contract address
        // });

        fetch(`${BASE_URL}/events`, {
            body: JSON.stringify({ 
                publicAddress: 'string',
                ownerAddress: description,
                name: name,
                description: address, // for nullable fields
                location: address,
                startDate: start,
                endDate: end,
                quota:quota,
             }),
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'POST'
          }).then(response => response.json())
          .then(res=>{
              console.log(res);
          })
          .catch(err=>console.log(err))

    }
}

export default CreateEvent;