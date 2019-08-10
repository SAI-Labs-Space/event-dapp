import React, { useState,useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

function SignUpModal({callback, ...props}) {

    const [ethAddress, setEthAddress] = useState("");
    const [email, setemail] = useState("");
    const [realName, setRealName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [tnc, setTnc] = useState(false);

    const dispatchToggle = () => {
        props.toggle(false);
    }
    useEffect(() => {
        if(props.ethAddr){
            setEthAddress(props.ethAddr);
        }
    });
    const signUp = () => {
        // do something
        callback({ethAddress,email,realName,phoneNumber});
        dispatchToggle();
     }

    const formComplete = ethAddress.length !== 0 && email.length !== 0 && realName.length !== 0 && tnc;

    return (
        <div>
            <Modal isOpen={props.show} toggle={dispatchToggle} className={""}>
                <ModalHeader toggle={dispatchToggle}>Create Account</ModalHeader>
                <ModalBody>
                    <div>
                        <div className="form-group">
                            <label className="control-label">Ethereum Address</label>
                            <input type="text" readOnly={true} className="form-control" value={ethAddress} onChange={(e) => setEthAddress(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="control-label">Email</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setemail(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="control-label">Real Name</label>
                            <input type="text" className="form-control" value={realName} onChange={(e) => setRealName(e.target.value)} />
                            <span className="form-text text-muted">We only share this so the event organizer can identify you on their event.</span>
                        </div>
                        <div className="form-group">
                            <label className="control-label">Phone Number <span className="text-muted">(optional)</span></label>
                            <input type="text" className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <input onChange={()=>{}} onClick={() => setTnc(!tnc)} checked={tnc} type="checkbox" className="form-control" /> I agree with <a href="https://www.google.com" target="_blank">terms and condition</a>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="default" onClick={dispatchToggle}>Cancel</Button>{' '}
                    <Button disabled={!formComplete} color="primary" onClick={signUp}>Sign Up</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default SignUpModal;
