const blockchainController = require("../services/service.blockchain");
const dynamoController = require("../services/service.dynamo");

const randomFourDigits = () => {
  let number = [];
  for (let i = 0; i < 4; i++) {
    number.push(Math.floor(Math.random() * (5 - 1 + 1)) + 1);
  }
  return number.join("");
};
const createUserName = (user_id) => {
  const string = user_id.replace(/[^a-zA-Z]+/g, "").substring(0, 4);
  const output = "bg" + string + randomFourDigits();
  return output;
};

const createAccount = async (user_id, context) => {
  try {
    const new_account = createUserName(user_id);
    
    console.log('new_account is..', new_account);

    if (!new_account) {
      console.log("Cannot create generate new account name");
      throw "Cannot create generate new account name";
    }
    console.log(
      `Attempting to create new account for user_id, ${user_id} and created username ${new_account}`
    );
    const blockchainUser = await blockchainController.createBlockchainUser(
      context.privKey,
      new_account
    );
    const { transaction_id } = blockchainUser || "";

    if (!transaction_id) {
      console.log(
        "Failed to generate blockchain eosjs account - no transaction_id returned "
      );
      throw "Failed to generate blockchain eosjs account - no transaction_id returned";
    }

    const database = await dynamoController.writeUser(new_account, user_id);

    if (!database) {
      console.log(
        `System Failure: write account ${new_account} and user_id ${user_id} to db`
      );
      throw `System Failure: write account ${new_account} and user_id ${user_id} to db`;
    }
    const response = {
      success: true,
      account_name: new_account,
      user_id: user_id,
      transaction_id: blockchainUser.transaction_id
    };
    console.log(`Successful transaction`, response);
    return response;
  } catch (error) {
    console.log(`newAccount.controller error ${JSON.stringify(error)}`);
    throw error;
  }
};

module.exports = {
  createAccount
};
