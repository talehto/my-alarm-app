/**
 * This module will generate a public and private keypair and save to current directory
 * 
 * Make sure to save the private key elsewhere after generated!
 */
 const crypto = require('crypto');
 const jwt = require('jsonwebtoken');
 
 function generateSecret() {
  console.log(crypto.randomBytes(64).toString('hex'))
 
  const token1 = jwt.sign({ username: 'a@c' }, 'abcd', {
    algorithm: 'HS256',
    expiresIn: '1d'
    } );

  const token2 = jwt.sign({ username: 'a@c' }, 'abcd', {
    algorithm: 'HS256',
    expiresIn: '1d'
    } );

  console.log(token1)
  console.log(token2)
 }
 
 // Generate the keypair
 generateSecret();
 