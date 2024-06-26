import api from "../../api/api"

const viewvideogame= async() =>{
  const response = await api.get('/videogames')
  const flattenedData = response.data.flat();
  console.log(response.data)
  return flattenedData;
}
const searchgame = async(name) =>{
  const response = await api.get('/videogames',{
    params: {
      name: name
    }
  })
  const flattenedData = response.data.flat();
  return flattenedData;
}
const getGameById = async (id) => {
  const response = await api.get(`/videogames/${id}`);
  return response.data;
}
const createGame = async (
  name,
  description,
  platforms,
  image,
  releaseDate,
  rating,
  genres,
) => {
    const response = await api.post('/videogames', {
      name,
      description,
      platforms,
      image,
      releaseDate,
      rating,
      genres,
    });
    return response.data;
  
};


export default{
  viewvideogame,
  searchgame,
  getGameById,
  createGame
}