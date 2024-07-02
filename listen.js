const { app } = require("./app");

const server = app.listen(9098, () =>
  console.log("App listening on port 9098!")
);

module.exports = { server };
