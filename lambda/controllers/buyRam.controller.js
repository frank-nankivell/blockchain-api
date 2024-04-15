const dynamoController = require("../services/service.dynamo");
const blockchainController = require("../services/service.blockchain");
const { get } = require("lodash");

const buyRamBytes = async ({ user_id, context }) => {
  try {
    const accountData = await dynamoController.getUser(user_id);
    const account = get(accountData, "Item.account_name.S");

    if (!accountData || !account) {
      console.log(`Invalid account details for sender or reciever`);
      throw `Invalid account details for account`;
    }
    console.log(`Atempting to update ram for user..`,account);
    const request = await blockchainController.buyBlockchainRam(
      context.privKey,
      account
    );
    const { transaction_id } = request;
    if (!request || !transaction_id) {
      console.log(`BuyRam byts - Blockchain request failed`);
      throw `BuyRam byts - Blockchain request failed`;
      // write error item to db
    }
    return transaction_id;
  } catch (error) {
    console.log(`buyRam.controller error ${JSON.stringify(error)}`);
    throw error;
  }
};

module.exports = {
  buyRamBytes
};
