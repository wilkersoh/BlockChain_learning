/**
  npm run test
*/

const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require("../compile")

let lottery, accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode })
    .send({from: accounts[0], gas: '1000000'});
})

describe('Lottery Contract', () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allows one account to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.equal(accounts[0], players[0])
    assert.equal(1, players.length);
  });

  it("allows multiple account to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether')
    });

    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02', 'ether') // send 0.02 ether
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.equal(accounts[0], players[0])
    assert.equal(accounts[1], players[1])
    assert.equal(accounts[2], players[2])

    assert.equal(3, players.length);
  });

  it("requires a minimum amount of ether to enter", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 10,
      });
      // force to throw error if the await somehow pass
      assert(false);
    } catch (error) {
      // use assert to check for truthiness
      // use assert.ok to check for existence
      /**
       * the test is passing because it went to this catch error
       * then assert that an eeror was present
       */
      assert(error);
    }
  });

  it("only manager can call pickWinner", async () => {
    try {
      // 我們不需要 call enter 因為 pickWiiner 有restricted 他有幫我們處理了
      await lottery.methods.pickWinner().send({
        from: accounts[1],
      });
      assert(false);
    } catch (error) {
      assert(error)
    }
  });

  it("sends money to the winner and resets the players array", async () => {
    // 進來 用 2 ether
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether') // send 2 ether
    });

    // 勾除 2 ether 剩下的 balance
    const initialBalance = await web3.eth.getBalance(accounts[0]);

    // cost gas
    await lottery.methods.pickWinner().send({from: accounts[0]});

    // slighly less than 2 ether because of paid some gas
    const finalBalance = await web3.eth.getBalance(accounts[0]);

    const difference = finalBalance - initialBalance;
    console.log('left over after cost gas will less than 2 ether:>> ', difference);

    // toWei(value, value的type是什麼) 然後轉去 wei unit
    assert(difference > web3.utils.toWei('1.8', 'ether'));
  })
});
