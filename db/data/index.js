// Will export data dependant on the environment in which its chosen
const ENV = process.env.NODE_ENV || "development";

const testData = require("./test-data/test-data");
const devData = require("./development-data/dev-data");

const data = {
  test: testData,
  development: devData,
  production: devData
};

module.exports = data[ENV];
