// setep local instance web3
import Web3 from 'web3';

// metamask chrome extension 會自動 insert web3 variable in window
const currentProvider = window.web3.currentProvider;
const web3 = new Web3(currentProvider);

export default web3;
