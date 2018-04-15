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
    const results = await run([cliPath], localVarInputs);
    setTimeout(() => {
      expect(results).toMatch(commands.local);
      test();
    }, 500);
  });

  it("runs staging command", async test => {
    const results = await run([cliPath], stagingVarInputs);
    setTimeout(() => {
      expect(results).toMatch(commands.staging);
      test();
    }, 500);
  });

  it("runs production command", async test => {
    const results = await run([cliPath], productionVarInputs);
    setTimeout(() => {
      expect(results).toMatch(commands.production);
      test();
    }, 500);
  });
});
