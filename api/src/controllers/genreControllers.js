const axios = require("axios");
const { Genre } = require("../app/db");
require("dotenv").config();
const { URL_API_GENRE, API_KEY } = process.env;

//add genres from API to DB
const getAllGenres = async () => {
  //if I have all games in my DB, I use them from there.
  let genresDb = await Genre.findAll({
    attributes: ["name"],
  });
  if (!genresDb.length) {
    const apiResult = await axios.get(`${URL_API_GENRE}?key=${API_KEY}`);

    const genresData = apiResult.data.results.map((g) => {
      return {
        id: g.id,
        name: g.name,
      }
    });

    await Genre.bulkCreate(genresData)

    genresDb = genresData.map(g => {
      return {
        id: g.id,
        name: g.name
      }
    })
  } else {
    genresDb = genresDb.map(g => {
      return {
        id: g.id,
        name: g.name
      }
    })
  }
  return genresDb
};

module.exports = getAllGenres;