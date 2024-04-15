const AWS = require("aws-sdk");
const getKey = new Promise((resolve, reject) => {
  const dynamodb = new AWS.DynamoDB();
  var params = {
    TableName: "Keys",
    KeyConditionExpression: "#cid = :cidd",
    ExpressionAttributeNames: {
      "#cid": "cid",
    },
    ExpressionAttributeValues: {
      ":cidd": { S: "telos-mainnet" },
    },
  };
  dynamodb.query(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to read item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      reject(err);
    } else {
      let context = {
        privKey: data.Items[0].private_key.S,
      };
      resolve(context);
    }
  });
});

module.exports = { getKey };
