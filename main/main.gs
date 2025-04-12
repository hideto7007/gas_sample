const main = (a, b) => {
  return (a + b) * 5;
};

// Node.js 環境なら export する（GASでは無視される）
if (typeof module !== "undefined") {
  module.exports = { main };
}