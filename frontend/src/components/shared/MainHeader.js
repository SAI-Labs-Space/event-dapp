import React, { useState, useEffect } from 'react';
import SignupModal from './SignUpModal';
import connector from '../../util/connector';
import { useGlobalState } from '../../util/state';
import { toast } from 'react-toastify';
import { IsLogged } from '../../consumer';

const BASE_URL = 'http://localhost:8000/api';

function MainHeader() {

    const [showSignup, setSignupModal] = useState(false);
    const [ethAddr, setEthAddr] = useGlobalState('address');
    const [loggedAddress, setloggedAddress] = useState('');
    const [name, setName] = useGlobalState('name');
    const [email, setEmail] = useGlobalState('email');
    const [accessToken, setAccessToken] = useGlobalState('accessToken');

    return (
        <div className=" desktop-menu menu-top-w menu-activated-on-hover">
            <div className="menu-top-i">
                <div className="logo-w">
                    <a className="logo" href="index.html"><img src="/img/logo.png" /></a>
                </div>
                <div className="logged-user-w">
                    <ul className="main-menu">
                        <li className="has-sub-menu">
                            {name === "" ? (
                                <a onClick={() => handleClick()}>
                                    <span>Login (Metamask)</span>
                                </a>
                            ) : (
                                    <span>{name}</span>
                                )}
                        </li>
                        {/* <li className="has-sub-menu">
                            <a onClick={() => setSignupModal(!showSignup)}>
                                <span>Signup</span>
                            </a>
                        </li> */}
                    </ul>
                </div>
            </div>

            <IsLogged loggedAddress={loggedAddress}/>
            <SignupModal show={showSignup} toggle={setSignupModal} ethAddr={ethAddr} callback={callback} />
        </div>
    )

    async function handleClick() {
        if (!connector.haveMetamask()) {
            window.alert('Please install MetaMask first.');
            return;
        }
        let web3;

        try {
            web3 = await connector.getWeb3();
        } catch (err) {
            window.alert(err);
            return;
        }

        const coinbase = await web3.eth.getCoinbase();
        if (!coinbase) {
            window.alert('Please activate MetaMask first.');
            return;
        }


        const publicAddress = coinbase.toLowerCase();
        let user = {};
        fetch(`${BASE_URL}/users?publicAddress=${publicAddress}`)
            .then(response => response.json()).then(users => {
                if (users.length == 0) {
                    setEthAddr(publicAddress);
                    setSignupModal(true)
                    return Promise.resolve({ signature: null })
                } else {
                    user = users[0];
                    return handleSignMessage(user.publicAddress, user.nonce)
                }
            }).then(({ publicAddress, signature }) => {
                if (signature == null) {
                    return Promise.resolve(null);
                }
                return fetch(`${BASE_URL}/auth`, {
                    body: JSON.stringify({ publicAddress, signature }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST'
                }).then(response => response.json())
            }).then(res => {
                if (res != null) {
                    setAccessToken(res.accessToken);
                    setName(user.name);
                    setEmail(user.email);
                    setloggedAddress(user.publicAddress);

                    toast.success("Login Success!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            });

        // let data = await handleSignMessage(publicAddress,1234);
        // console.log(data);
    }

    async function handleSignMessage(publicAddress, nonce) {
        let web3;
        try {
            web3 = await connector.getWeb3();
            console.log(web3);
            const signature = await web3.eth.personal.sign(
                `I am signing my one-time nonce: ${nonce}`,
                publicAddress,
                '' // MetaMask will ignore the password argument here
            );

            return { publicAddress, signature };
        } catch (err) {
            console.log(err);
            throw new Error('You need to sign the message to be able to log in.');
        }
    };

    function callback({ ethAddress, emailAdress, realName, phoneNumber }) {


        fetch(`${BASE_URL}/users`, {
            body: JSON.stringify({
                publicAddress: ethAddress,
                email: emailAdress,
                name: realName,
                phoneNumber: phoneNumber,
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        }).then(response => response.json())
            .then(res => {
                let nonce = res.nonce;
                return handleSignMessage(ethAddress, nonce)
            }).then(({ publicAddress, signature }) => {
                return fetch(`${BASE_URL}/auth`, {
                    body: JSON.stringify({ publicAddress, signature }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST'
                }).then(response => response.json())
            }).then(res => {
                const accessToken = res.accessToken;
                console.log(accessToken);
                setName(realName);
                setEmail(emailAdress);
            });

    }

}

export default MainHeader;