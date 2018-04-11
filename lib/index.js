const { prompt } = require("inquirer");
const { logAndExecute, updateLocalVariables } = require("./fileUpdates.js");
const {
  getEnvKey,
  getPackageName,
  localUserInput,
  stagingUserInput,
  productionUserInput
} = require("./userInputs.js");

function processUserInputs(
  key,
  envFilePath,
  stagingCommand,
  productionCommand
) {
  return async ({ get, confirm, verify, environment }) => {
    const { confirmation } = await prompt(confirm);
    if (confirmation) {
      const { value } = await prompt(get);
      const { verified } = await prompt(verify(key, value));
      if (!verified) return;
      switch (environment.toLowerCase()) {
        case "local":
          return updateLocalVariables(envFilePath, key, value);
        case "staging":
          return logAndExecute(stagingCommand(key, value));
        case "production":
          return logAndExecute(productionCommand(key, value));
      }
    }
  };
}

async function envManager({
  envFilePath = "./.env",
  stagingCommand,
  productionCommand
}) {
  const { key } = await prompt(getEnvKey);
  const processInputs = processUserInputs(
    key,
    envFilePath,
    stagingCommand,
    productionCommand
  );

  await processInputs(localUserInput);
  await processInputs(stagingUserInput);
  await processInputs(productionUserInput);
}

module.exports = envManager;
