const { Router } = require("express");
const routerGenres = Router();

//handlers
const genresHandler = require("../handlers/genreHandlers");

routerGenres.get("/", genresHandler);

module.exports = routerGenres;
