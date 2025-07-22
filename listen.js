const { app } = require("./app");

const server = app.listen(9099, () =>
  console.log("App listening on port 9099!")
);

module.exports = { server };
