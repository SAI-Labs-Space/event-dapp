import Web3 from 'web3';

class Connector{
    
    constructor(){
        this.web3=null;
    }
    
    haveMetamask(){
        return window.ethereum;
    }

    async initWeb3(){
        if (this.web3==null) {
            try {
                // Request account access if needed
                await window.ethereum.enable();
        
                // We don't know window.web3 version, so we use our own instance of Web3
                // with the injected provider given by MetaMask
                this.web3 = new Web3(window.ethereum);
            } catch (error) {
                throw new Error('You need to allow MetaMask.');
            }
        }
    }

    async getCoinbase(){
        return  await this.web3.eth.getCoinbase();
    }

    async getWeb3(){
        if (this.web3==null) {
            await this.initWeb3();
            return this.web3;
        }else{
            return this.web3;
        }
    }

}
let connector  = new Connector();
export default   connector;