const systemResponse = (code, data) => {
  return {
    statusCode: code,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Cache-Control": "no-cache"
    },
    body: JSON.stringify(data)
  };
};
module.exports = { systemResponse };
