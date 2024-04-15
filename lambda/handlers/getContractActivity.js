const { BLOCKCHAIN_PASS } = process.env;
const transferTokenNotification = require("../notifications/transactions.notification");
const keysController = require("../services/service.keys");
const contractActivityController = require("../controllers/contractActivity.controller");
const responseUtil = require("../utils/response");
const { get } = require("lodash");

module.exports.handler = async (event) => {
  try {
    const { body } = event || {};
    const payload = JSON.parse(body);
    const data = get(payload, "data", "");
    const { routePassword } = data || "";
    if (!payload || !data || !routePassword) {
      return responseUtil.systemResponse(400, {
        success: false,
        error: "Invalid payload",
        payload: payload
      });
    }
    if (routePassword !== BLOCKCHAIN_PASS) {
      return responseUtil.systemResponse(400, {
        success: false,
        error: "Invalid password provided for protected route!"
      });
    }
    const context = await keysController.getKey;

    if (!context) {
      console.log("Cannot access private key", context);
      return responseUtil.systemResponse(500, {
        success: false,
        error: "Cannot access private key"
      });
    }
    const { user_id } = data || "";
    if (!user_id) {
      return responseUtil.systemResponse(403, {
        success: false,
        error: "Invalid payload - user_id is required as a string or array"
      });
    }
    console.log(`getting transactions for`, user_id);

    const transactions = await contractActivityController.contractActivity(
      user_id
    );
    if (!transactions) {
      throw (`Failed to get transactions token at contractActivityController`,
      transactions);
    }
    const output = { success: true, transactions };
    return responseUtil.systemResponse(200, output);
  } catch (error) {
    await transferTokenNotification.notify(event, error);
    console.log(`[System failure - transferToken] error`, error);
    return responseUtil.systemResponse(500, {
      success: false,
      error: `System failure`,
      message: error
    });
  }
};
