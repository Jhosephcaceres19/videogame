const axios = require("axios");
require("dotenv").config(); // Carga las variables de entorno desde el archivo .env
const { URL_API, API_KEY } = process.env;

const { Videogame, Genre } = require("../app/db"); // Importa los modelos de Videojuego y Género desde la configuración de la base de datos

// Función para obtener todos los videojuegos desde la API externa
const getVgamesApi = async () => {
  let gamesReady = []; // Array para almacenar los videojuegos formateados
  let nextPage = `${URL_API}?key=${API_KEY}`; // URL inicial para obtener los videojuegos desde la API
  let pageCount = 0; // Contador de páginas para limitar las peticiones

  // Iteración para obtener varias páginas de resultados (hasta 6 páginas o hasta que no haya más páginas)
  while (nextPage && pageCount < 6) {
    const { data } = await axios(nextPage); // Realiza la petición HTTP para obtener los datos de la siguiente página
    gamesReady.push( // Agrega al array los videojuegos filtrados y formateados
      data.results
        .filter((g) => g.rating > 0) // Filtra los videojuegos con una calificación mayor a 0
        .map((g) => ({
          id: g.id,
          name: g.name,
          background_image: g.background_image,
          rating: g.rating,
          genres: g.genres.map((gen) => gen.name), // Mapea los nombres de los géneros de cada videojuego
        }))
    );
    nextPage = data.next; // Actualiza a la URL de la siguiente página de resultados
    pageCount++; // Incrementa el contador de páginas
  }
  return gamesReady; // Retorna el array de videojuegos formateados
};

// Función para obtener todos los videojuegos desde la base de datos local
const getVgamesDb = async () => {
  let dbgamesReady = []; // Array para almacenar los videojuegos formateados desde la base de datos

  const vgamesDB = await Videogame.findAll({ // Busca todos los videojuegos en la base de datos local
    include: Genre, // Incluye los géneros asociados a cada videojuego
  });

  dbgamesReady.push( // Agrega al array los videojuegos formateados desde la base de datos
    vgamesDB.map((g) => ({
      id: g.id,
      name: g.name,
      image: g.image,
      rating: g.rating,
      genres: g.Genres.map((gen) => gen.name), // Mapea los nombres de los géneros de cada videojuego
    }))
  );
  return dbgamesReady; // Retorna el array de videojuegos formateados desde la base de datos
};

// Función para obtener todos los videojuegos (API y base de datos local combinados)
const getAllGames = async () => {
  const [vgamesApi, vgamesDb] = await Promise.all([ // Obtiene los videojuegos desde la API y la base de datos local en paralelo
    getVgamesApi(),
    getVgamesDb(),
  ]);
  return [...vgamesApi, ...vgamesDb]; // Retorna un array combinado de todos los videojuegos
};

// Función para buscar videojuegos por nombre (API y base de datos local combinados)
const searchVgameByName = async (name) => {
  const [vgamesApi, vgamesDb] = await Promise.all([ // Obtiene los videojuegos desde la API y la base de datos local en paralelo
    getVgamesApi(),
    getVgamesDb(),
  ]);

  // Filtra los videojuegos por nombre (insensible a mayúsculas y minúsculas)
  const filteredGames = [];
  [...vgamesApi, ...vgamesDb].forEach((innerArray) => {
    const filteredInnerArray = innerArray.filter(
      (g) =>
        g.name &&
        g.name.trim().toLowerCase().includes(name.trim().toLowerCase())
    );
    filteredGames.push(...filteredInnerArray);
  });

  const first15Games = filteredGames.slice(0, 15); // Obtiene los primeros 15 videojuegos filtrados
  return first15Games; // Retorna los videojuegos filtrados
};

// Función para obtener detalles de un videojuego por su ID (tanto desde la API como desde la base de datos local)
const getVgameById = async (idVideogame) => {
  if (!idVideogame) {
    throw new Error("Put an ID!"); // Lanza un error si no se proporciona un ID de videojuego
  }

  if (idVideogame.includes("-")) { // Si el ID de videojuego incluye '-', se asume que es de la base de datos local
    let videogameDb = await Videogame.findOne({ // Busca el videojuego en la base de datos local
      where: {
        id: idVideogame,
      },
      include: Genre, // Incluye los géneros asociados al videojuego
    });

    if (!videogameDb) {
      throw new Error(
        `The videogame doesn't exist in the DataBase, with ID: ${id}`
      ); // Lanza un error si el videojuego no existe en la base de datos local
    }

    videogameDb = JSON.parse(JSON.stringify(videogameDb)); // Convierte el objeto Sequelize en un objeto JSON plano
    videogameDb.Genres = videogameDb.Genres.map((g) => g.name); // Mapea los nombres de los géneros del videojuego
    return videogameDb; // Retorna el videojuego desde la base de datos local
  } else { // Si no tiene '-', se asume que es un ID de la API externa
    const response = await axios.get( // Realiza una petición GET a la API externa para obtener el detalle del videojuego
      `${URL_API}/${idVideogame}?key=${API_KEY}`
    );

    const {
      id,
      name,
      background_image: image,
      genres,
      description,
      released: releaseDate,
      rating,
      platforms,
    } = response.data; // Extrae los datos relevantes del videojuego desde la respuesta de la API

    const formattedGenres = genres.map((g) => g.name); // Mapea los nombres de los géneros del videojuego desde la API
    const formattedPlatforms = platforms.map((p) => p.platform.name); // Mapea los nombres de las plataformas del videojuego desde la API

    return {
      id,
      name,
      image,
      genres: formattedGenres,
      description,
      releaseDate,
      rating,
      platforms: formattedPlatforms,
    }; // Retorna el videojuego formateado desde la API externa
  }
};

// Función para crear un nuevo videojuego en la base de datos local
const addGame = async (
  name,
  description,
  releaseDate,
  rating,
  genres,
  platforms,
  image
) => {
  if (
    !name ||
    !description ||
    !releaseDate ||
    !rating ||
    !genres ||
    !platforms ||
    !image
  ) {
    throw new Error("All fields are required"); // Lanza un error si no se completan todos los campos requeridos para crear un videojuego
  }

  if (genres.length === 0) {
    throw new Error("You must add at least 1 genre."); // Lanza un error si no se proporciona al menos un género para el videojuego
  }

  if (!Array.isArray(platforms)) {
    throw new Error("Platforms must be an array."); // Lanza un error si las plataformas no se proporcionan como un array
  }

  const [videogame, created] = await Videogame.findOrCreate({ // Busca o crea un nuevo videojuego en la base de datos local
    where: {
      name,
    },
    defaults: {
      description,
      releaseDate,
      rating,
      platforms, // Guarda las plataformas como un array
      image,
    },
  });

  if (!created) {
    throw new Error("This videogame is already exists!"); // Lanza un error si el videojuego ya existe en la base de datos local
  }

  const genreNames = genres.map((g) => (typeof g === "string" ? g : g.name)); // Obtiene los nombres de los géneros para el videojuego

  const genreInstances = await Genre.findAll({ // Busca los géneros en la base de datos local
    where: { name: genreNames },
  });

  if (genreInstances.length !== genreNames.length) {
    throw new Error("Some genres were not found in the DB"); // Lanza un error si algunos géneros no se encuentran en la base de datos local
  }

  await videogame.addGenres(genreInstances); // Asocia los géneros al videojuego en la base de datos local
  return {
    ...videogame.toJSON(),
    genres: genreNames,
  }; // Retorna el videojuego creado con los géneros asociados
};

module.exports = {
  getAllGames,
  searchVgameByName,
  getVgameById,
  addGame
};
