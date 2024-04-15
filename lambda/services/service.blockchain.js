const { Api, JsonRpc } = require("eosjs");
const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig"); // development only
const fetch = require("node-fetch");
const {
  PUBLIC_KEY,
  EOS_API_URL,
  MAIN_ACCOUNT,
  ENVIRONMENT,
  CONTRACT_SYMBOL
} = process.env;

async function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const parseAmount = (x) => {
  return Number.parseFloat(x).toFixed(4);
};
const createBlockchainUser = async (privateKey, newAccount) => {
  if (ENVIRONMENT == "prod") return await createAccount(privateKey, newAccount);
  console.log(
    `ENVIRONMENT`,
    ENVIRONMENT,
    "So returning dummy data with 2 second timeout"
  );
  await timeout(2000);
  return {
    transaction_id:
      "testc347e07d47a6d9eb2a2b2fe349d0d40d92280c8c827963b775affc7test"
  };
};
const createAccount = async (privateKey, newAccount) => {
  try {
    const rpc = new JsonRpc(EOS_API_URL, {
      fetch
    });

    const mainAccount = MAIN_ACCOUNT;
    const contract = "eosio";
    const publicKey = PUBLIC_KEY;

    const signatureProvider = new JsSignatureProvider([ privateKey ]);

    const api = new Api({
      rpc,
      signatureProvider
    });
    const response = await api
      .transact(
        {
          actions: [
            {
              account: contract,
              name: "newaccount",
              authorization: [
                {
                  actor: mainAccount,
                  permission: "active"
                }
              ],
              data: {
                creator: mainAccount,
                name: newAccount,
                owner: {
                  threshold: 1,
                  keys: [
                    {
                      key: publicKey,
                      weight: 1
                    }
                  ],
                  accounts: [],
                  waits: []
                },
                active: {
                  threshold: 1,
                  keys: [
                    {
                      key: publicKey,
                      weight: 1
                    }
                  ],
                  accounts: [],
                  waits: []
                }
              }
            },
            {
              account: contract,
              name: "buyrambytes",
              authorization: [
                {
                  actor: mainAccount,
                  permission: "active"
                }
              ],
              data: {
                payer: mainAccount,
                receiver: newAccount,
                bytes: 8192
              }
            },
            {
              account: contract,
              name: "delegatebw",
              authorization: [
                {
                  actor: mainAccount,
                  permission: "active"
                }
              ],
              data: {
                from: mainAccount,
                receiver: newAccount,
                stake_net_quantity: "0.1000 TLOS",
                stake_cpu_quantity: "0.1000 TLOS",
                transfer: true
              }
            }
          ]
        },
        {
          blocksBehind: 3,
          expireSeconds: 30
        }
      )
      .catch(async (err) => {
        console.log(`blockchain error, ${err}`);
        throw `blockchain error, ${err}`;
      });
    return response;
  } catch (error) {
    console.log(`createBlockchainUser ${JSON.stringify(error)}`);
    throw error;
  }
};

const getCurrencyBalance = async (account) => {
  try {
    const rpc = new JsonRpc(EOS_API_URL, {
      fetch
    });
    const response = await rpc
      .get_currency_balance(MAIN_ACCOUNT, account, CONTRACT_SYMBOL)
      .catch(async (error) => {
        console.log(`Failed get_currency_balance ${JSON.stringify(error)}`);
        throw ("Failed to get balancem", error);
      });
    if (!response[0]) {
      return {
        balance: 0
      };
    } else {
      return {
        balance: response[0]
      };
    }
  } catch (error) {
    console.log(`getCurrencyBalance ${JSON.stringify(error)}`);
    throw error;
  }
};

const transferBlockchainToken = async (key, sender, reciever, amount, memo) => {
  if (ENVIRONMENT == "prod")
    return await transferToken(key, sender, reciever, amount, memo);
  console.log(
    `ENVIRONMENT`,
    ENVIRONMENT,
    "So returning dummy data with 3 second timeout"
  );
  await timeout(3000);
  return {
    transaction_id:
      "testc347e07d47a6d9eb2a2b2fe349d0d40d92280c8c827963b775affc7test"
  };
};
const transferToken = async (key, sender, reciever, amount, memo) => {
  const rpc = new JsonRpc(EOS_API_URL, {
    fetch
  });
  const contract = MAIN_ACCOUNT;
  const signatureProvider = new JsSignatureProvider([ key ]);
  const api = new Api({
    rpc,
    signatureProvider
  });
  const parsedAmount = parseAmount(amount);
  console.log(`parsedAmount...`, parsedAmount);
  try {
    const response = await api
      .transact(
        {
          actions: [
            {
              account: MAIN_ACCOUNT,
              name: "transfer",
              authorization: [
                {
                  actor: contract,
                  permission: "active"
                },
                {
                  actor: sender,
                  permission: "active"
                }
              ],
              data: {
                from: sender,
                to: reciever,
                quantity: `${parsedAmount} ${CONTRACT_SYMBOL}`,
                memo: memo
              }
            }
          ]
        },
        {
          blocksBehind: 3,
          expireSeconds: 30
        }
      )
      .catch(async (err) => {
        console.log('err', err)
        if (JSON.stringify(err).includes(`${sender} has insufficient ram`)) {
          const ramtopUp = await buyRamBytes(key, sender);
          console.log(`ramtopUp ...`, ramtopUp);
          throw `blockchain error due ${sender} having insufficient, but shouldn't happen again, topup...${JSON.stringify(
            ramtopUp
          )}`;
        } else {
          console.log(`blockchain error, ${err}`);
          throw `blockchain error, ${err}`;
        }
      });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const buyBlockchainRam = async (key, account) => {
  if (ENVIRONMENT == "prod") return await buyRamBytes(key, account);
  console.log(
    `ENVIRONMENT`,
    ENVIRONMENT,
    "So returning dummy data with 3 second timeout"
  );
  await timeout(3000);
  return {
    transaction_id:
      "testc347e07d47a6d9eb2a2b2fe349d0d40d92280c8c827963b775affc7test"
  };
};

const buyRamBytes = async (privateKey, account) => {
  try {
    const rpc = new JsonRpc(EOS_API_URL, {
      fetch
    });

    const mainAccount = MAIN_ACCOUNT;
    const contract = "eosio";
    const signatureProvider = new JsSignatureProvider([ privateKey ]);

    const api = new Api({
      rpc,
      signatureProvider
    });
    const response = await api
      .transact(
        {
          actions: [
            {
              account: contract,
              name: "buyrambytes",
              authorization: [
                {
                  actor: mainAccount,
                  permission: "active"
                }
              ],
              data: {
                payer: mainAccount,
                receiver: account,
                bytes: 8192
              }
            }
          ]
        },
        {
          blocksBehind: 3,
          expireSeconds: 30
        }
      )
      .catch(async (err) => {
        console.log(`blockchain error, ${err}`);
        throw `blockchain error, ${err}`;
      });
    console.log(`Completed buying ram`, response);
    return response;
  } catch (error) {
    console.log(`createBlockchainUser ${JSON.stringify(error)}`);
    throw error;
  }
};
module.exports = {
  buyBlockchainRam,
  transferBlockchainToken,
  createBlockchainUser,
  getCurrencyBalance
};
