module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: [ "benchmark"],
    files: [
      "./benchmarks/*-benchmark.js"
    ],
    exclude: [],
    reporters: [ "benchmark"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ["Firefox", "Chrome"],
    singleRun: true,
    concurrency: Infinity,
    detectBrowsers: {
      enable: true,
    },
    browserDisconnectTimeout: 500000,
    browserNoActivityTimeout: 500000
  });
};
