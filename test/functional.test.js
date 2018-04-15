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
    expect(results).toMatch(commands.local);
    test();
  });

  it("runs staging command", async test => {
    const results = await run([cliPath], stagingVarInputs);
    expect(results).toMatch(commands.staging);
    test();
  });

  it("runs production command", async test => {
    const results = await run([cliPath], productionVarInputs);
    expect(results).toMatch(commands.production);
    test();
  });
});
