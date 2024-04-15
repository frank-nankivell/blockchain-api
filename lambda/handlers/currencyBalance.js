const { BLOCKCHAIN_PASS } = process.env;
const currencyBalancenotification = require("../notifications/currencyBalance.notification");
const currencyBalancecontroller = require("../controllers/currencyBalance.controller");
const responseUtil = require("../utils/response");

module.exports.handler = async (event) => {
  try {
    const { body } = event || {};
    const payload = JSON.parse(body);
    const { data } = payload || {};
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
    const { user_id } = data || "";
    if (!user_id) {
      return responseUtil.systemResponse(403, {
        success: false,
        error: "Invalid payload - user_id is required as a string or array"
      });
    }
    console.log(`getting balance for`, user_id);

    const balance = await currencyBalancecontroller.currencyBalance(user_id);
    if (!balance) {
      throw `Failed to get balance  ${user_id}`;
    }
    return responseUtil.systemResponse(200, balance);
  } catch (error) {
    await currencyBalancenotification.notify(event, error);
    console.log(`[System failure - currencyBalance] error`, error);
    return responseUtil.systemResponse(500, {
      success: false,
      error: `System failure`,
      message: error
    });
  }
};
