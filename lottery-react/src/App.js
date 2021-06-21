import { useEffect, useState } from "react";
import Web3 from "web3";
import lottery from './lottery';

/**
 * How to start
 * 1. go to lottery folder
 * 2. yarn deploy
 * 3. copy address and interface
 * 4. paste those value into lottery-react/lottery.js
 * 5. fill in value more than 0.1 ether
 * 6. submit
 */

function App() {
  window.ethereum.request({ method: "eth_requestAccounts" });
  // window.ethereum._metamask.isUnlocked();
  const web3 = new Web3(window.ethereum);

  // web3.eth.getAccounts().then((result) => console.log("getAccounts :>> ", result));

  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getManager = async () => await lottery.methods.manager().call()

    const getPlayers = async () => await lottery.methods.getPlayers().call();

    const getBalance = async () => await web3.eth.getBalance(lottery.options.address);

    const allResults = async () => {
      console.log("call")
      const [manager, players, balance] = await Promise.all([
        getManager(),
        getPlayers(),
        getBalance(),
      ]);

      setManager(manager)
      setPlayers(players)
      setBalance(balance)
      console.log("callend");
    }

    allResults();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transaction success...");
    /**
     * send transaction to the network
     * need 15 or 30 sec time.
     */
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });

    setMessage("You have been entered!");
  }

  const pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transaction success...");

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage("A winner has been picked!");
  }

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}</p>
      <p>
        There are currently {players.length} people entered, competing to win{" "}
        {/* fromWei(value, 要轉去的unit type) */}
        {web3.utils.fromWei(balance, "ether")} ether!
      </p>

      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label htmlFor='amount'>Amount of ether to enter</label>
          <input type='number' onChange={(event) => setValue(event.target.value)} value={value} />
        </div>
        <button>Enter</button>
      </form>
      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={pickWinner}>Pick a winner!</button>
      <hr />
      <h1>{message}</h1>
    </div>
  );
}

export default App;
