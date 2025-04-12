function sample(value) {
  return value === "sample" ? "ok" : "ng";
}

// Node.js 環境なら export する（GASでは無視される）
if (typeof module !== "undefined") {
  module.exports = { sample };
}
