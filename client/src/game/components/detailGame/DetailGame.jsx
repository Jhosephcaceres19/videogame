import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Service from '../../service/Service';
import { Navbar } from "../navbar/Navbar";
import './DetailGame.css'; 

export const DetailGame = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const gameDetails = await Service.getGameById(id);
        console.log(gameDetails); 
        setGame(gameDetails);
      } catch (error) {
        console.error('Error al obtener los detalles del juego', error);
      }
    };

    fetchGameDetails();
  }, [id]);

  if (!game) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="detail-game-container">
      <Navbar />
      <h1>{game.name}</h1>
      <h3>ID: {game.id}</h3>
      <p>Rating: {game.rating}</p>
      {game.genres && (
        <p className="genres">Genres: {game.genres.join(', ')}</p>
      )}
      {game.description && (
        <p className="description">Description: <span dangerouslySetInnerHTML={{ __html: game.description }} /></p>
      )}
      {game.image && (
        <img src={game.image} alt={game.name} />
      )}
      <p className="release-date">Fecha de lanzamiento: {game.releaseDate}</p>
      {game.platforms && (
        <p className="platforms">Plataformas: {game.platforms.join(', ')}</p>
      )}
    </div>
  );
};
