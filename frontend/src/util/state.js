import { createGlobalState } from 'react-hooks-global-state';

const initialState = { address: '',
web3:null,
accessToken:'',
name:'',
email:'' };
const { GlobalStateProvider, useGlobalState } = createGlobalState(initialState);


export { GlobalStateProvider, useGlobalState };
