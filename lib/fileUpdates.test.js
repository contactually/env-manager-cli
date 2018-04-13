const { logError } = require("./fileUpdates");
describe("Logs Errors", () => {
  it("returns null without error", () => {
    expect(logError()).toBeUndefined();
  });
});
