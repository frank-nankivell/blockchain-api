const { BLOCKCHAIN_PASS } = process.env;

const keysController = require("../services/service.keys");
const newAccountNotification = require("../notifications/newAccount.notification");
const responseUtil = require("../utils/response");
const newAccountcontroller = require("../controllers/newAccount.controller");

module.exports.handler = async (event) => {
  let _user_id = "";
  let multiResponse = [];
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
    const context = await keysController.getKey;

    if (!context) {
      console.log("Cannot access private key", context);
      return responseUtil.systemResponse(500, {
        success: false,
        error: "Cannot access private key"
      });
    }

    const { user_id } = data || [];

    if (!user_id || user_id.length === 0) {
      return responseUtil.systemResponse(403, {
        success: false,
        error: "Invalid payload - user_id is required as a string or array"
      });
    }
    _user_id = user_id;

    if (user_id instanceof Array) {
      console.log(`processing multiple accounts`, user_id);
      await Promise.all(
        user_id.map(async (id) => {
          const item = await newAccountcontroller.createAccount(id, context);
          multiResponse.push(item);
        })
      );
      return responseUtil.systemResponse(200, multiResponse);
    }

    if (user_id) {
      console.log(`processing single account`, user_id);
      const single = await newAccountcontroller.createAccount(user_id, context);
      if (!single) {
        throw `Failed to create account for user_id ${user_id}`;
      }
      return responseUtil.systemResponse(200, single);
    }
    return responseUtil.systemResponse(500, {
      success: false,
      error: "Something went wrong"
    });
  } catch (error) {
    await newAccountNotification.notify(_user_id, error, multiResponse);
    console.log(`[System failure - newUser] error`, error);
    return responseUtil.systemResponse(500, {
      success: false,
      error: `System failure`,
      message: error
    });
  }
};
