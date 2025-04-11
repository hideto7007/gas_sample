const { sample } = require("../../main/sample");

describe("sample", () => {
  test("sample success return OK", () => {
    expect(sample("sample")).toBe("ok");
  });

  test("sample success return NG", () => {
    expect(sample("test")).toBe("ng");
  });
});
