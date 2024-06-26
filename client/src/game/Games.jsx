import React from 'react';
import './Games.css';
import { Link } from 'react-router-dom';

export const Games = ({ games }) => {
  return (
    <div className='content-home'>
      {games.map((game) => (
        <Link key={game.id} to={`/home/${game.id}`} className='game-card'>
            <img src={game.background_image ? game.background_image: game.image} alt={game.name} />
            <h2>{game.name}</h2>
            <p>Rating: {game.rating}</p>
            <p>Genres: {game.genres.join(', ')}</p>
        </Link>
          
      ))}
    </div>
  );
};




