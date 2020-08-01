module.exports.default = function ping(payload, options, ref) {
  return { payload, options, ref, message: "pong" };
};
