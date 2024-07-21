const { Router } = require("express");
const routerVgames = Router();

//handlers
const {
  getVgamesHandler,
  getVgameByIdHandler,
  createHandler,
} = require("../handlers/gameHandlers");

routerVgames.get("/", getVgamesHandler);
routerVgames.get("/:idVideogame", getVgameByIdHandler);
routerVgames.post("/", createHandler);

module.exports = routerVgames;
