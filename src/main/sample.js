function sample(value) {
  return value === "sample" ? "ok" : "ng";
}

const getInfo = (data) => {
  if (data.num * 2 > 26) {
    data.result = "ok"
  } else if (data.num * 2 < 20) {
    data.result = "good"
  } else {
    data.result = "No"
  }
  return data
}

// Node.js 環境なら export する（GASでは無視される）
if (typeof module !== "undefined") {
  module.exports = { sample, getInfo };
}
