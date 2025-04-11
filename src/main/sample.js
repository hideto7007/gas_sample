function sample(value) {
  return value === "sample" ? "ok" : "ng";
}

if (typeof module !== "undefined") {
  module.exports = { sample };
}
