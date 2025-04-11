const { main } = require("../../../src/main/main");

describe("main", () => {
  test("main success 1", () => {
    expect(main(5, 5)).toBe(50);
  });

  test("main success 2", () => {
    expect(main(12, 3)).toBe(75);
  });
});
