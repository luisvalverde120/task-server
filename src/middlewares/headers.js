function allowCrossDomain(req, res, next) {
  res.header("Access-Control-Expose-Headers", "access-token");
  res.header("Access-Control-Allow-Origin", "*");
  next();
}

module.exports = allowCrossDomain;
