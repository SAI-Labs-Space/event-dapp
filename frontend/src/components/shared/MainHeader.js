import React, { useState,useEffect } from 'react';
import SignupModal from './SignUpModal';
import connector from '../../util/connector';
const BASE_URL='http://localhost:8000/api';

function MainHeader() {

    const [showSignup, setSignupModal] = useState(false);
    const [name, setName] = useState("");
    const [ethAddr, setEthAddr] = useState("")

    return (
        <div className=" desktop-menu menu-top-w menu-activated-on-hover">
            <div className="menu-top-i">
                <div className="logo-w">
                    <a className="logo" href="index.html"><img src="/img/logo.png" /></a>
                </div>
                <div className="logged-user-w">
                    <ul className="main-menu">
                        <li className="has-sub-menu">
                        {name==="" ? (
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

            <SignupModal show={showSignup} toggle={setSignupModal} ethAddr={ethAddr} callback={callback} />
        </div>
    )
    
    async function handleClick() {
        if (!connector.haveMetamask()) {
            window.alert('Please install MetaMask first.');
            return;
        }
        let web3;

        try{
            web3 = await connector.getWeb3();
        }catch(err){
            window.alert(err);
            return;
        }

        const coinbase = await web3.eth.getCoinbase();
        if (!coinbase) {
            window.alert('Please activate MetaMask first.');
            return;
        }
        
        
        const publicAddress = coinbase.toLowerCase();
        let realName = '';
        fetch(`${BASE_URL}/users?publicAddress=${publicAddress}`)
        .then(response => response.json()).then(users =>{
            if(users.length==0){   
                setEthAddr(publicAddress);      
                setSignupModal(true)
                return Promise.resolve({signature:null})
            }else{
                const user = users[0];
                realName = user.name;
                return handleSignMessage(user.publicAddress,user.nonce)
            }
        }).then(({publicAddress,signature}) =>{
            if(signature==null){
                return Promise.resolve(null);
            }
            return fetch(`${BASE_URL}/auth`, {
                body: JSON.stringify({ publicAddress, signature }),
                headers: {
                  'Content-Type': 'application/json'
                },
                method: 'POST'
              }).then(response => response.json())
        }).then(res=>{
            if(res!=null){
                const accessToken = res.accessToken;
                console.log(accessToken);
                setName(realName);
            }
        });
          
        //await signMessage(publicAddress,1234);
    }

    async function  handleSignMessage (publicAddress,nonce){
        let web3;
        try {
            web3 = await connector.getWeb3();
            console.log(web3);
          const signature =  web3.eth.personal.sign(
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

    function callback ({ethAddress,email,realName,phoneNumber}) {
      console.log({email,realName,phoneNumber});

      fetch(`${BASE_URL}/users`, {
        body: JSON.stringify({ 
            publicAddress:ethAddress,
            email:email,
            name:realName,
            phoneNumber:phoneNumber,
         }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }).then(response => response.json())
      .then(res=>{
          let nonce = res.nonce;
          return handleSignMessage(ethAddress,nonce)
      }).then(({publicAddress,signature}) =>{
        return fetch(`${BASE_URL}/auth`, {
            body: JSON.stringify({ publicAddress, signature }),
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'POST'
          }).then(response => response.json())
    }).then(res=>{
            const accessToken = res.accessToken;
            console.log(accessToken);
            setName(realName);
    });

    }

}

export default MainHeader;