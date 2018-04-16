import run, { UP, DOWN, ENTER } from "inquirer-test";
const cliPath = "demo/index.js";

const key = "KEY";

const values = {
  local: "localVal",
  staging: "stagingVal",
  production: "productionVal"
};

const commands = {
  local: /setting local variable KEY=localVal/,
  staging: /heroku config:set KEY=stagingVal/,
  production: /heroku config:set KEY=productionVal/
};

const localVarInputs = [key, ENTER, ENTER, values.local, ENTER, ENTER];
const stagingVarInputs = [
  ...localVarInputs,
  ENTER,
  values.staging,
  ENTER,
  ENTER
];
const productionVarInputs = [
  ...stagingVarInputs,
  ENTER,
  values.production,
  ENTER,
  ENTER
];

describe("envManager", () => {
  it("sets local variables", async test => {
    run([cliPath], localVarInputs).then(value => {
      expect(value).toMatch(commands.local);
      test();
    });
  });

  it("runs staging command", async test => {
    run([cliPath], stagingVarInputs).then(value => {
      expect(value).toMatch(commands.staging);
      test();
    });
  });

  it("runs production command", async test => {
    run([cliPath], productionVarInputs).then(value => {
      expect(value).toMatch(commands.production);
      test();
    });
  });
});
