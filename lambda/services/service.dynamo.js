const {
  DEFAULT_AWS_REGION,
  USER_TABLE,
  SURVEY_RESPONSE_TABLE,
  TOKEN_ENTRYS_TABLE,
} = process.env;
const AWS = require("aws-sdk");

const writeUser = async (account_name, user_id) => {
  try {
    const docClient = new AWS.DynamoDB.DocumentClient({
      region: DEFAULT_AWS_REGION,
    });
    console.log(`attempting to write user to Dynamodb ${user_id}`);
    const table = USER_TABLE;
    const params = {
      TableName: table,
      Item: {
        account_name: account_name,
        user_id: user_id,
      },
    };
    const res = await docClient.put(params).promise();
    return res;
  } catch (error) {
    console.log(`[writeUser] error`, error);
    throw error;
  }
};

const getUser = async (user_id) => {
  try {
    const dynamodb = new AWS.DynamoDB({
      region: DEFAULT_AWS_REGION,
    });
    const table = USER_TABLE;
    const params = {
      TableName: table,
      Key: {
        user_id: {
          S: user_id,
        },
      },
    };
    const res = await dynamodb.getItem(params).promise();
    return res;
  } catch (error) {
    console.log(`[getUser] error`, error);
    throw error;
  }
};

const writeSurvey = async ({
  sender_user_id,
  sender_account_name,
  survey_hash,
  transaction_id,
}) => {
  try {
    const docClient = new AWS.DynamoDB.DocumentClient({
      region: DEFAULT_AWS_REGION,
    });
    console.log(`attempting to write survey to Dynamodb ${sender_user_id}`);
    var paramsSurveyResponse = {
      TableName: SURVEY_RESPONSE_TABLE,
      Item: {
        account_name: sender_account_name,
        user_id: sender_user_id,
        survey_hash: survey_hash,
        transaction_id: transaction_id,
      },
    };
    const response = await docClient.put(paramsSurveyResponse).promise();
    console.log("Saving survey,", response);
    return response;
  } catch (error) {
    console.log(`[writeSurvey] error`, error);
    throw error;
  }
};
const writeTransaction = async ({
  sender_user_id,
  sender_account_name,
  receiver_user_id,
  receiver_account_name,
  survey_hash,
  amount,
  transaction_id,
}) => {
  try {
    const docClient = new AWS.DynamoDB.DocumentClient({
      region: DEFAULT_AWS_REGION,
    });
    console.log(`attempting to write survey to Dynamodb ${sender_user_id}`);
    var paramsTransactions = {
      TableName: TOKEN_ENTRYS_TABLE,
      Item: {
        event_id: transaction_id,
        contract: process.env.MAIN_ACCOUNT,
        from: sender_account_name,
        from_user_id: sender_user_id,
        memo: survey_hash,
        quantity: amount,
        time: new Date(),
        to: receiver_account_name,
        to_user_id: receiver_user_id,
        transaction_id: transaction_id,
      },
    };
    const txResponse = await docClient.put(paramsTransactions).promise();
    console.log("Saving transactions,", txResponse);
    return txResponse;
  } catch (error) {
    console.log(`[writeSurvey] error`, error);
    throw error;
  }
};
const getTransactions = async (account) => {
  try {
    const dynamodb = new AWS.DynamoDB({
      region: DEFAULT_AWS_REGION,
    });
    const toQuery = {
      TableName: TOKEN_ENTRYS_TABLE,
      IndexName: "to_index",
      KeyConditionExpression: "#to = :account_name",
      ExpressionAttributeNames: {
        "#to": "to",
      },
      ExpressionAttributeValues: {
        ":account_name": { S: account },
      },
      Limit: 200,
    };
    const fromQuery = {
      TableName: TOKEN_ENTRYS_TABLE,
      IndexName: "from_index",
      KeyConditionExpression: "#from = :account_name",
      ExpressionAttributeNames: {
        "#from": "from",
      },
      ExpressionAttributeValues: {
        ":account_name": { S: account },
      },
      Limit: 200,
    };
    const sent = await dynamodb.query(fromQuery).promise();
    const recieved = await dynamodb.query(toQuery).promise();
    return { sent, recieved };
  } catch (error) {
    console.log(`[getTransactions] error`, error);
    throw error;
  }
};

module.exports = {
  writeUser,
  getUser,
  writeSurvey,
  writeTransaction,
  getTransactions,
};
