pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;

    function Lottery() public {
        // 第一個 deploy的 人 就是 manager
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, players));
    }

    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(this.balance);

        players = new address[](0);
    }

    modifier restricted() {
        require(msg.sender == manager);
        _; //  這個是 把 那個 restricted 下面的 fn 放過來的 概念
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }
}