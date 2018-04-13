const { logError, logAndExecute } = require("./fileUpdates");
const process = require("child_process");

describe("Logs Errors", () => {
  it("returns null without error", () => {
    expect(logError()).toBeUndefined();
  });

  it("returns error if one exists", () => {
    const logSpy = jest.spyOn(console, "log");
    const error = "my error";
    logError(error);
    expect(logSpy).toBeCalledWith(error);
  });
});

describe("logAndExecute", () => {
  it("logs commands", () => {
    const logSpy = jest.spyOn(console, "log");
    const error = "my error";
    logAndExecute(error);
    expect(logSpy).toBeCalledWith(error);
  });
  it("executes commands", () => {
    const execSpy = jest.spyOn(process, "exec");
    const error = "my error";
    logAndExecute(error);
    expect(execSpy).toBeCalledWith(error);
  });
});
