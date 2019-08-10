import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

function LoginModal(props) {

    const [ethAddress, setEthAddress] = useState("");
    const [email, setemail] = useState("");
    const [realName, setRealName] = useState("");
    const [twiiter, setTwiiter] = useState("");
    const [tnc, setTnc] = useState(false);

    const dispatchToggle = () => {
        props.toggle(false);
    }

    const signUp = () => {
        // do something
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
                            <label className="control-label">Email</label>
                            <input type="text" className="form-control" value={ethAddress} onChange={(e) => setEthAddress(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="control-label">Password</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setemail(e.target.value)} />
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

export default LoginModal;
