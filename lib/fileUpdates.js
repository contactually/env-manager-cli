const fs = require("fs");
const colors = require("colors/safe");
const { exec } = require("child_process");
const { prompt } = require("inquirer");

const logError = err => {
  if (err) return console.log(err);
};

const writeToFile = (envFilePath, key, printedVal) => (err, data) => {
  if (data && data.indexOf(`${key}=`) >= 0) {
    const result = data.replace(new RegExp(key + "=.+"), `${printedVal}`);
    fs.writeFile(envFilePath, result, "utf8", logError);
  } else {
    fs.appendFile(envFilePath, `${printedVal}\n`, logError);
  }
};

const updateLocalVariables = (envFilePath, key, value) => {
  const printedVal = `${key}=${value}`;
  fs.readFile(
    envFilePath,
    { flag: "w" },
    writeToFile(envFilePath, key, printedVal)
  );
  console.log(colors.bold.red(`🔥  setting local variable ${printedVal} 🔥`));
};

const logAndExecute = statement => {
  console.log(`🔥  ${colors.bold.red(statement)} 🔥`);
  exec(statement);
};

const updateVarByEnvironment = (environment, envFilePath, values, commands) => {
  const { key, value } = values;
  const { stagingCommand, productionCommand } = commands;
  switch (environment.toLowerCase()) {
    case "local":
      updateLocalVariables(envFilePath, key, value);
      break;
    case "staging":
      logAndExecute(stagingCommand(key, value));
      break;
    case "production":
      logAndExecute(productionCommand(key, value));
      break;
    default:
      return false;
  }
};

const processUserInputs = (
  key,
  envFilePath,
  stagingCommand,
  productionCommand
) => {
  return async ({ get, confirm, verify, environment }) => {
    const { confirmation } = await prompt(confirm);
    if (confirmation) {
      const { value } = await prompt(get);
      const { verified } = await prompt(verify(key, value));
      if (!verified) return;
      const values = { key, value };
      const commands = { stagingCommand, productionCommand };
      updateVarByEnvironment(environment, envFilePath, values, commands);
    }
  };
};

module.exports = {
  logError,
  writeToFile,
  logAndExecute,
  processUserInputs,
  updateLocalVariables,
  updateVarByEnvironment
};
