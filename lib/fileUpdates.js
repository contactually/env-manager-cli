const fs = require("fs");
const colors = require("colors/safe");
const { exec } = require("child_process");

const logError = err => {
  if (err) return console.log(err);
};

const updateLocalVariables = (envFilePath, key, value) => {
  fs.readFile(envFilePath, { flag: "w" }, (err, data) => {
    if (data && data.indexOf(`${key}=`) >= 0) {
      const result = data.replace(new RegExp(key + "=.+"), `${key}=${value}`);
      fs.writeFile(envFilePath, result, "utf8", logError);
    } else {
      fs.appendFile(envFilePath, `${key}=${value}\n`, logError);
    }
  });
  console.log(colors.bold.red(`🔥  setting local variable ${key}=${value} 🔥`));
};

const logAndExecute = statement => {
  console.log(`🔥  ${colors.bold.red(statement)} 🔥`);
  exec(statement);
};

module.exports = {
  logAndExecute,
  updateLocalVariables
};
