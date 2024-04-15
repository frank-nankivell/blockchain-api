const dynamoController = require("../services/service.dynamo");
const blockchainController = require("../services/service.blockchain");
const { get } = require("lodash");
const currencyBalance = async (user_id) => {
  try {
    const user = await dynamoController.getUser(user_id);
    if (!user) {
      console.log(`Invalid account - ${user_id} not stored to database`);
      throw `Invalid account -  ${user_id}not stored to database`;
    }
    const account = get(user, "Item.account_name.S", "");
    if (!account) {
      console.log(`Invalid account - ${user_id} incorrectly stored for the db`);
      throw `Invalid account -  ${user_id} incorrectly stored for the db`;
    }
    const balance = await blockchainController.getCurrencyBalance(account);
    return balance;
  } catch (error) {
    console.log(`currencyBalance.controller error ${JSON.stringify(error)}`);
    throw error;
  }
};

module.exports = {
  currencyBalance
};
