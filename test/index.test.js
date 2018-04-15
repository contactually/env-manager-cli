const envManager = require("../lib/index");

jest.mock("inquirer", () => ({ prompt: jest.fn(arg => arg) }));

describe("envManager", () => {
  it("returns a function", () => {
    expect(envManager).toBeInstanceOf(Function);
  });

  it("resolves", () => {
    expect.assertions(1);
    return envManager({}).then(data => {
      expect(data).toBe(undefined);
    });
  });
});
