const { prompt } = require("inquirer");
const { processUserInputs } = require("./fileUpdates.js");
const {
  getEnvKey,
  localUserInput,
  stagingUserInput,
  productionUserInput
} = require("./userInputs.js");

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
