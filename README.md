# headless-mint
Uses headless chrome to make manual updates in mint.com for accounts they don't support.

Currently this supports both a manually added mortgage and a cash account for [RobinHood](https://www.robinhood.com/). If you want to use it to update your mortgage, you should manually edit the values in `index.js`;

Your username and password get encrypted locally, though it would be easy for someone with the code to decrypt.

## Get started
1. Clone
2. `npm install`
3. `npm run encrypt` to input your mint.com Credentials
4. `npm run encrypt-robinhood` to add your robinhood Credentials
5. `npm start` (for robinhood), or `node index.js` for mortgage. 
