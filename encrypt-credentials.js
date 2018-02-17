const prompt = require('prompt');

const crypto = require('crypto');
const fs = require('fs');

const algorithm = 'aes192';
const password = ';alksdjf;lakdjf';

/**
 * [encrypt encrypts the credentials]
 * @param  {[type]} text [description]
 * @return {[type]}      [description]
 */
function encrypt(text) {
  let cipher = crypto.createCipher(algorithm, password);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

prompt.start();

prompt.get(['username',
  {
    name: 'password',
    hidden: true,
  },
], function(err, result) {
  fs.writeFile('credentials', encrypt(JSON.stringify(result)), (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('Credentials saved!');
  });
});
