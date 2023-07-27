/**
 * This module will generate a public and private keypair and save to current directory
 * 
 * Make sure to save the private key elsewhere after generated!
 */
 const crypto = require('crypto');
 
 
 function generateSecret() {
  console.log(crypto.randomBytes(64).toString('hex'))
 
 }
 
 // Generate the keypair
 generateSecret();
 