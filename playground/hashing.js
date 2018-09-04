const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};

var token = jwt.sign(data, 'someSaltKey');

console.log(`Token ${token}`);

var decoded = jwt.verify(token, 'someSaltKey');

console.log('Decoded', decoded);

/* SHA256 hashing and salt encoding - MANUAL OPERATION

var message = 'im user 6';
var hashedMessage = SHA256(message);

console.log(`Message: ${message}`);
console.log(`Hashed message: ${hashedMessage}`);

//payload
var data = {
    id: 10
};

var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'someSaltKey').toString()
};

//data tampered in mid
token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString(); 

var resultHash = SHA256(JSON.stringify(token.data) + 'someSaltKey').toString();

if (resultHash === token.hash) {
    console.log('Data was not changed');
} else {
    console.log('Data was changed. Donot trust');
} */