/**
 * node deploy.js
 */

const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const {interface, bytecode} = require("./compile");

/**
  https://infura.io/dashboard/ethereum
  use infura to create provider and link to web3
 */
const provider = new HDWalletProvider(
  "metamask memonic",
  "https://rinkeby.infura.io/v3/bd524b000a274b75bb1d3de985a42cf6"
);

// provider 通過 web3 就可以和 eth network 做交流了
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode, arguments: ['Hi there!']})
    .send({from: accounts[0], gas: '1000000'});

  console.log('Contract deployed to :>> ', result.options.address);
}
