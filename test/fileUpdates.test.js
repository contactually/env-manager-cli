const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const {
  logError,
  writeToFile,
  logAndExecute,
  processUserInputs,
  updateLocalVariables,
  updateVarByEnvironment
} = require("../lib/fileUpdates");

jest.mock("fs", () => ({
  readFile: jest.fn((path, flag, callback) => {
    callback();
  }),
  writeFile: jest.fn(),
  appendFile: jest.fn()
}));

jest.mock("child_process", () => ({ exec: jest.fn() }));
jest.mock("inquirer", () => ({ prompt: cb => cb }));

let consoleLogCalledWith;
const envPath = path.join(__dirname, ".env");
const key = "TEST";
const val = "test_val";
const commands = { stagingCommand: jest.fn(), productionCommand: jest.fn() };

describe("file updates", () => {
  beforeEach(() => {
    console.log = jest.fn();
    consoleLogCalledWith = val => console.log.mock.calls[0][0].includes(val);
  });

  describe("logError", () => {
    it("returns null without error", () => {
      expect(logError()).toBeUndefined();
    });

    it("returns error if one exists", () => {
      const error = "my error";
      logError(error);
      expect(consoleLogCalledWith(error)).toBe(true);
    });
  });

  describe("logAndExecute", () => {
    it("executes commands", () => {
      const error = "exec error";
      logAndExecute(error);
      expect(exec).toBeCalledWith(error);
    });

    it("logs commands", () => {
      const error = "my error";
      logAndExecute(error);
      expect(consoleLogCalledWith(error)).toBe(true);
    });
  });

  describe("writeToFile", () => {
    const printArg = "TEST=newVal";
    const write = writeToFile(envPath, key, printArg);

    describe("if data already has key", () => {
      it("overwrite values", () => {
        write(null, `${key}=old_val`);
        expect(fs.writeFile).toBeCalledWith(
          envPath,
          printArg,
          "utf8",
          expect.any(Function)
        );
      });
    });

    describe("if data does not have key", () => {
      it("appends values", () => {
        writeToFile(envPath, key, printArg)(null, "");
        expect(fs.appendFile).toBeCalledWith(
          envPath,
          `${printArg}\n`,
          expect.any(Function)
        );
      });
    });
  });

  describe("updateLocalVariables", () => {
    it("reads file with correct args", () => {
      updateLocalVariables(envPath, key, val);
      expect(fs.readFile).toBeCalledWith(
        envPath,
        { flag: "w" },
        expect.any(Function)
      );
    });

    it("logs new value", () => {
      updateLocalVariables(envPath, key, val);
      expect(consoleLogCalledWith(`${key}=${val}`)).toBe(true);
    });
  });

  describe("updateVarByEnvironment", () => {
    const values = { key: "updateKey", value: "updateVal" };
    const runUpdateWithEnv = env =>
      updateVarByEnvironment(env, "path", values, commands);

    it("calls local updater with correct args", () => {
      runUpdateWithEnv("local");
      expect(consoleLogCalledWith(`${values.key}=${values.value}`)).toBe(true);
    });

    it("calls staging updater with correct args", () => {
      runUpdateWithEnv("staging");
      expect(commands.stagingCommand.mock.calls.length).toBe(1);
    });

    it("calls production updater with correct args", () => {
      runUpdateWithEnv("production");
      expect(commands.productionCommand.mock.calls.length).toBe(1);
    });

    it("returns false if no environments match", () => {
      expect(runUpdateWithEnv("nonsense")).toBe(false);
    });
  });

  describe("processUserInputs", () => {
    const { stagingCommand, productionCommand } = commands;
    const getUserInputs = processUserInputs(
      key,
      envPath,
      stagingCommand,
      productionCommand
    );

    it("returns undefined when verified", async () => {
      const userInputArgs = {
        get: { value: "val" },
        verify: () => ({ verified: true }),
        confirm: { confirmation: true },
        environment: "local"
      };
      expect(await getUserInputs(userInputArgs)).toBe(undefined);
    });

    it("returns undefined when unverified", async () => {
      const userInputArgs = {
        get: { value: "val" },
        verify: () => ({ verified: false }),
        confirm: { confirmation: true },
        environment: "local"
      };
      expect(await getUserInputs(userInputArgs)).toBe(undefined);
    });
  });
});
