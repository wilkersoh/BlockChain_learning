pragma solidity ^0.4.17;

contract Inbox {
    string public message;

    // Inbox 和 contract 名一樣 就是 JS裡的 constructor
    function Inbox(string initialMessage) public {
        message = initialMessage;
    }

    function setMessage(string newMessage) public {
        message = newMessage;
    }
}
