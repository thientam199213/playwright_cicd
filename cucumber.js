// cucumber.js
module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["tests/steps/**/*.ts", "tests/support/**/*.ts"],
    paths: ["tests/features/**/*.feature"],
    publishQuiet: true,
    format: ["progress", "html:cucumber-report.html"],
    timeout: 60000, // apply for all steps
  },
};
