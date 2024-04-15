const { BLOCKCHAIN_PASS } = process.env;
const standardNotification = require("../notifications/standard.notification");
const buyRamBytesController = require("../controllers/buyRam.controller");
const responseUtil = require("../utils/response");
const keysController = require("../services/service.keys");

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
    const context = await keysController.getKey;

    if (!context) {
      console.log("Cannot access private key", context);
      return responseUtil.systemResponse(500, {
        success: false,
        error: "Cannot access private key"
      });
    }
    console.log(`buying ram for...`, user_id);

    const ram = await buyRamBytesController.buyRamBytes({user_id, context});
    if (!ram) {
      throw `Failed to buyRam for  ${user_id}`;
    }
    const output = { success: true, transaction_id: ram };
    return responseUtil.systemResponse(200, output);
  } catch (error) {
    await standardNotification.notify(event, error, "Buy Ram Bytes");
    console.log(`[System failure - buyRam] error`, error);
    return responseUtil.systemResponse(500, {
      success: false,
      error: `System failure`,
      message: error
    });
  }
};
