const envManager = require("../lib/index.js");

envManager({
  stagingCommand: (key, value) => `heroku config:set ${key}=${value} test`,
  productionCommand: (key, value) => `heroku config:set ${key}=${value} prod`
});
