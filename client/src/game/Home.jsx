import React, { useEffect, useState } from 'react';
import './Home.css';
import { Navbar } from './components/navbar/Navbar';
import { Games } from './Games'; 
import Service from './service/Service';

const Home = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState({ genre: 'All', origin: 'All' });
  const [sort, setSort] = useState({ field: 'name', order: 'asc' });
  const gamesPerPage = 15;

  const genres = [
    { id: 3, name: 'Action' },
    { id: 2, name: 'Indie' },
    { id: 4, name: 'Adventure' },
    { id: 5, name: 'RPG' },
    { id: 1, name: 'Strategy' },
    { id: 6, name: 'Shooter' },
    { id: 7, name: 'Casual' },
    { id: 8, name: 'Simulation' },
    { id: 9, name: 'Puzzle' },
    { id: 10, name: 'Arcade' },
    { id: 11, name: 'Platformer' },
    { id: 12, name: 'Racing' },
    { id: 13, name: 'Massively Multiplayer' },
    { id: 14, name: 'Sports' },
    { id: 15, name: 'Fighting' },
    { id: 16, name: 'Family' },
    { id: 17, name: 'Board Games' },
    { id: 18, name: 'Educational' },
    { id: 19, name: 'Card' },
  ];

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const viewvideogames = await Service.viewvideogame();
        setGames(viewvideogames);
      } catch (error) {
        console.error('Error al cargar los juegos:', error);
      }
    };
    fetchGames();
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        let searchResults;
        if (searchTerm) {
          searchResults = await Service.searchgame(searchTerm);
        } else {
          const viewvideogames = await Service.viewvideogame();
          searchResults = viewvideogames;
        }
        setGames(searchResults);
      } catch (error) {
        console.error('Error al buscar juegos:', error);
      }
    };
    fetchSearchResults();
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1); 
  }, [filter]);

  const handleSearch = () => {
    setSearchTerm(inputValue);
  };

  const filteredAndSortedGames = games
    .filter(game => {
      
      if (filter.origin !== 'All') {
        if (filter.origin === 'API' && !game.fromAPI) {
          return false;
        }
        if (filter.origin === 'Database' && game.fromAPI) {
          return false;
        }
      }

      // Filtrar por género si no es 'todos'
      if (filter.genre !== 'All' && filter.genre !== '') {
        return game.genres.some(g => g === filter.genre);
      }

      return true; // Mostrar todos los juegos si no hay filtro por género específico
    })
    .sort((a, b) => {
      // Ordenar
      if (sort.field === 'name') {
        return sort.order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (sort.field === 'rating') {
        return sort.order === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      }
      return 0;
    });

  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredAndSortedGames.slice(indexOfFirstGame, indexOfLastGame);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredAndSortedGames.length / gamesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className='home-main'>
        <Navbar setGames={setGames} setSearchTerm={setSearchTerm} />

        <div className='cont-home'>
          <div className='filters'>
            <label>Género:</label>
            <select value={filter.genre} onChange={(e) => setFilter({ ...filter, genre: e.target.value })}>
              <option value='All'>Todos</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.name}>{genre.name}</option>
              ))}
            </select>

            <label>Origen:</label>
            <select value={filter.origin} onChange={(e) => setFilter({ ...filter, origin: e.target.value })}>
              <option value='All'>Todos</option>
              <option value='API'>API</option>
              <option value='Database'>Base de datos</option>
            </select>

            <label>Ordenar por:</label>
            <select onChange={(e) => setSort({ ...sort, field: e.target.value })}>
              <option value='name'>Nombre</option>
              <option value='rating'>Rating</option>
            </select>

            <label>Orden:</label>
            <select onChange={(e) => setSort({ ...sort, order: e.target.value })}>
              <option value='asc'>Ascendente</option>
              <option value='desc'>Descendente</option>
            </select>
          </div>
          <div>
            <input
              type='text'
              placeholder='Buscar juego...'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button onClick={handleSearch} className='button-search'>Buscar</button>
          </div>
        </div>

        <Games games={currentGames} />

        <div className='pagination'>
          <button className='juego' onClick={prevPage} disabled={currentPage === 1}>
            Anterior
          </button>
          <button
            className='juego'
            onClick={nextPage}
            disabled={currentPage === Math.ceil(filteredAndSortedGames.length / gamesPerPage)}
          >
            Siguiente
          </button>
          <span>Página {currentPage}</span>
        </div>
      </div>
    </>
  );
};

export default Home;
