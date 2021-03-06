const puppeteer = require('puppeteer');
const rp = require('request-promise');

const crypto = require('crypto');
const fs = require('fs');

const algorithm = 'aes192';
const password = ';alksdjf;lakdjf';

/**
 * decrypts that encrpyted text!
 * @param  {[type]} text [description]
 * @return {[type]}      [description]
 */
function decrypt(text) {
  let decipher = crypto.createDecipher(algorithm, password);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}
/**
 * [robinhood description]
 */
function Robinhood() {
  this.credentials = function() {
    let contents = fs.readFileSync('credentials-robinhood', 'utf8');
    let credentials = JSON.parse(decrypt(contents));
    this.username = credentials.username;
    this.password = credentials.password;
  };
  this.login = async function() {
    let tempToken = await rp.post('https://api.robinhood.com/api-token-auth/').form({
      username: this.username,
      password: this.password,
    }).catch((error) => console.log(error.body));
    this.token = JSON.parse(tempToken).token;
  };
  this.getAccounts = async function() {
    let result = await rp({
      uri: 'https://api.robinhood.com/accounts/',
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + this.token,
        'Accept': 'application/json',
      },
    }).catch((error) => console.log(error));
    this.portfolio = JSON.parse(result).results[0].portfolio;
  };
  this.getAccount = async function() {
    let result = await rp({
      uri: 'https://api.robinhood.com/accounts/5SS12059',
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + this.token,
        'Accept': 'application/json',
      },
    }).catch((error) => console.log(error));
  };
  this.getPortfolio = async function() {
    let result = await rp({
      uri: this.portfolio,
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + this.token,
        'Accept': 'application/json',
      },
    }).catch((error) => console.log(error));
    this.market_value = JSON.parse(result).market_value;
  };
}

/** This is the main funciton! **/
async function run() {
  let R = new Robinhood();
  R.credentials();
  await R.login();
  await R.getAccounts();
  await R.getPortfolio();
  console.log(R.market_value);

//
let username;
let password;
fs.readFile('credentials', 'utf8', function(err, contents) {
  let credentials = JSON.parse(decrypt(contents));
  username = credentials.username;
  password = credentials.password;
});

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: 'data',
    slowMo: 80,
  });

  const page = await browser.newPage();
  await page.goto('https://accounts.intuit.com/index.html?offering_id=Intuit.ifs.mint&namespace_id=50000026&redirect_url=https%3A%2F%2Fmint.intuit.com%2Foverview.event%3Futm_medium%3Ddirect%26cta%3Dnav_login_dropdown');

  await page.setViewport({
    width: 1366,
    height: 768,
  });

  await page.click('#ius-userid');
  await page.keyboard.type(username);

  await page.click('#ius-password');
  await page.keyboard.type(password);

  await page.click('#ius-sign-in-submit-btn');

  await page.waitForNavigation();
  await page.goto('https://mint.intuit.com/settings.event?filter=property');
  await page.waitForSelector('#product-view-root > div.productPageContent > div.pageContents > div.settingsPage > div:nth-child(2) > div > section > div > div > div.col-xs-14.col-sm-14.col-md-14.col-lg-14.settingsBodyContainer > div > div > section > ul > div > li:nth-child(1) > div > div > ul > li > section > span:nth-child(1)');

  await page.click('#product-view-root > div.productPageContent > div.pageContents > div.settingsPage > div:nth-child(2) > div > section > div > div > div.col-xs-14.col-sm-14.col-md-14.col-lg-14.settingsBodyContainer > div > div > section > ul > div > li:nth-child(1) > div > div > ul > li > section > span:nth-child(1)');
   await page.click('#product-view-root > div.productPageContent > div.pageContents > div.settingsPage > div:nth-child(2) > div > section > div > div > div.col-xs-14.col-sm-14.col-md-14.col-lg-14.settingsBodyContainer > div > div > section > ul > div > li:nth-child(1) > div > div > ul > li > form > div.accountDetailsFull > div > div:nth-child(2) > div > input');

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
   await page.keyboard.type(String(Math.round(R.market_value)));
  //
  // // save
  //
  await page.click('#product-view-root > div.productPageContent > div.pageContents > div.settingsPage > div:nth-child(2) > div > section > div > div > div.col-xs-14.col-sm-14.col-md-14.col-lg-14.settingsBodyContainer > div > div > section > ul > div > li:nth-child(1) > div > div > ul > li > form > div.accountDetailsFooter > a', {
    delay: 10,
  });

  // browser.close();
}

run();
