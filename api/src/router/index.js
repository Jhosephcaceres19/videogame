const { Router } = require("express");

const router = Router();
const routerGame = require("./game");
const routerGenres = require("./genres");

router.use("/videogames", routerGame);
router.use("/genres", routerGenres);

module.exports = router;
