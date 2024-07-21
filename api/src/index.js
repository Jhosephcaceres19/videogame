const { conn } = require("./app/db");
require("dotenv").config();

const app = require("./app/app");

const port = process.env.PORT || 3000;

conn.sync({ force: true }).then(() => {
  app.listen(port, () => {
    console.log(`server runing on port ${port}`);
  });
});

/***
 * const server = require("./src/app.js");
const { conn } = require("./src/db.js");
require("dotenv").config();
const { PORT } = process.env;

// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  server.listen(3000, () => {
    console.log(Server is listening on port: ${PORT}); // eslint-disable-line no-console
  });
});
 */
