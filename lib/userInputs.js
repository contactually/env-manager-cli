const colors = require("colors/safe");
const fs = require("fs");
const path = require("path");

const printValueAssignment = (key, value) => colors.green(`${key}=${value}`);

const getEnvKey = {
  type: "input",
  name: "key",
  message: "what is the name/key of the new environmental variable?",
  transformer: val => val.toUpperCase(),
  filter: val => val.toUpperCase()
};

const getPackageName = choices => ({
  type: "list",
  name: "package",
  message: "Which package or packages would you like to update?",
  choices: [...choices]
});

const getEnvConfirmation = env => ({
  type: "list",
  name: "confirmation",
  message: `Would you like to update the ${colors.red(env)} value?`,
  choices: ["Yes", "No"],
  filter: val => val === "Yes"
});

const getEnvValue = env => ({
  type: "input",
  name: "value",
  message: `what is the ${colors.red(
    env
  )} value of the new environmental variable?`
});

const verifyEnvValue = env => (key, value) => ({
  type: "list",
  name: "verified",
  message: `This will update the ${colors.red(
    env.toLowerCase()
  )} environment with ${printValueAssignment(key, value)}, are you sure?`,
  choices: ["Yes", "No"],
  filter: val => val === "Yes"
});

const createUserInputQuestions = environment => ({
  confirm: getEnvConfirmation(environment),
  get: getEnvValue(environment),
  verify: verifyEnvValue(environment),
  environment: environment.toLowerCase()
});

module.exports = {
  getEnvKey,
  getPackageName: packages => getPackageName(packages),
  localUserInput: createUserInputQuestions("Local"),
  stagingUserInput: createUserInputQuestions("Staging"),
  productionUserInput: createUserInputQuestions("Production")
};
