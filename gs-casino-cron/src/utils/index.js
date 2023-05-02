function roundOf(number, decimal) {
  return Math.round(number * 10 ** decimal) / 10 ** decimal;
}

function getTimeByCrashRate(crashRate) {
  return +(Math.log2(crashRate) / 0.09).toFixed(1);
}

module.exports = {
  roundOf,
  getTimeByCrashRate,
};
