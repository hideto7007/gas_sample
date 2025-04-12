const { sample, getInfo } = require("../../main/sample");

describe("sample", () => {
  test("sample success return OK", () => {
    expect(sample("sample")).toBe("ok");
  });

  test("sample success return NG", () => {
    expect(sample("test")).toBe("ng");
  });
});

describe("getInfo", () => {
  test("getInfo success return ok", () => {
    expect(
      getInfo({
        num: 13.1,
        result: "",
      })
    ).toEqual({ num: 13.1, result: "ok" });
  });

  test("getInfo success return good", () => {
    expect(
      getInfo({
        num: 9,
        result: "",
      })
    ).toEqual({ num: 9, result: "good" });
  });

  test("getInfo success return No", () => {
    expect(
      getInfo({
        num: 10,
        result: "",
      })
    ).toEqual({ num: 10, result: "No" });
  });
});
