const { BLOCKCHAIN_PASS } = process.env;
const transferTokenNotification = require("../notifications/transferToken.notification");
const keysController = require("../services/service.keys");
const transferTokenController = require("../controllers/transferToken.controller");
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
    const { sender, receiver, amount, survey_hash } = data || "";
    if (!sender || !receiver || !amount || !survey_hash) {
      return responseUtil.systemResponse(404, {
        success: false,
        error:
          "Invalid payload: sender sender, reciever, amount and survey_has required "
      });
    }
    const response = await transferTokenController.transferToken(data, context);
    if (!response) {
      throw (`Failed transfer token at transferTokenController`, response);
    }
    const output = { success: true, data: { transaction_id: response } };
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
