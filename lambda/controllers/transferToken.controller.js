const dynamoController = require("../services/service.dynamo");
const blockchainController = require("../services/service.blockchain");
const { get } = require("lodash");

const transferToken = async (
  { sender, receiver, amount, survey_hash },
  context
) => {
  try {
    console.log(`Getting account names for ${sender} and reciever ${receiver}`);
    const senderItem = await dynamoController.getUser(sender);
    const recieverItem = await dynamoController.getUser(receiver);
    const recieverAccountName = get(recieverItem, "Item.account_name.S");
    const senderAccountName = get(senderItem, "Item.account_name.S");

    if (!senderAccountName || !recieverAccountName) {
      console.log(`Invalid account details for sender or reciever`);
      throw `Invalid account details for sender or reciever`;
    }
    console.log(`Atempting to make transfer for ${amount}`);
    const transfer = await blockchainController.transferBlockchainToken(
      context.privKey,
      senderAccountName,
      recieverAccountName,
      amount,
      survey_hash
    );
    const { transaction_id } = transfer;
    if (!transfer || !transaction_id) {
      console.log(`Blockchain request failed`);
      throw `Blockchain request failed`;
    }
    const [tx, survey] = await Promise.all([dynamoController.writeTransaction({
      sender_user_id: sender,
      sender_account_name: senderAccountName,
      receiver_user_id: receiver,
      receiver_account_name: recieverAccountName,
      survey_hash: survey_hash,
      amount: amount,
      transaction_id: transaction_id
    }),dynamoController.writeSurvey({
      sender_user_id: sender,
      sender_account_name: senderAccountName,
      survey_hash: survey_hash,
      transaction_id: transaction_id
    })]);
    console.log(tx, survey)
    return transaction_id;
  } catch (error) {
    console.log(`transferToken.controller error ${JSON.stringify(error)}`);
    throw error;
  }
};

module.exports = {
  transferToken
};
