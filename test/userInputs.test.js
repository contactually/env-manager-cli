const {
  getEnvKey,
  verifyEnvValue,
  getPackageName,
  getEnvConfirmation
} = require("../lib/userInputs");

describe("getEnvKey", () => {
  it("transforms values", () => {
    expect(getEnvKey.transformer("test")).toBe("TEST");
  });

  it("filters values", () => {
    expect(getEnvKey.filter("test")).toBe("TEST");
  });
});

describe("getEnvConfirmation", () => {
  describe("filter", () => {
    it("returns false when not yes", () => {
      expect(getEnvConfirmation().filter("test")).toBe(false);
    });

    it("returns true when yes", () => {
      expect(getEnvConfirmation().filter("Yes")).toBe(true);
    });
  });

  describe("message", () => {
    it("prints env", () => {
      expect(getEnvConfirmation("test_env").message).toMatch(/test_env/);
    });
  });

  describe("verifyEnvValue", () => {
    const verify = verifyEnvValue("env")("key", "value");
    it("prints env", () => {
      expect(verify.message).toMatch(/key=value/);
    });

    it("filters values", () => {
      expect(verify.filter("Yes")).toBe(true);
    });
  });

  describe("getPackageName", () => {
    it("sets packages as choices", () => {
      const packages = ["firstPackage", "secondPackage"];
      const packageNames = getPackageName(packages);
      expect(packageNames.choices).toMatchObject(packages);
    });
  });
});
