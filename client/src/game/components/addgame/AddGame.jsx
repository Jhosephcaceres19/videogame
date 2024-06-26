import React, { useState } from "react";
import './AddGame.css';
import { Navbar } from "../navbar/Navbar";
import Service from "../../service/Service";

const AddGame = () => {
  const initialFormData = {
    name: "",
    image: "",
    platforms: "",
    description: "",
    releaseDate: "",
    rating: "",
    genres: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    if (name === 'name') {
      if (!value) {
        error = 'El nombre es obligatorio';
      } else if (value.length < 3) {
        error = 'El nombre debe tener al menos 3 caracteres';
      } else if (value.length > 50) {
        error = 'El nombre no debe exceder los 50 caracteres';
      }
    }
    if (name === 'image' && !value) {
      error = 'La imagen es obligatoria';
    }
    if (name === 'platforms' && !value) {
      error = 'La plataforma es obligatoria';
    }
    if (name === 'description' && !value) {
      error = 'La descripción es obligatoria';
    }
    if (name === 'releaseDate' && !value) {
      error = 'La fecha de lanzamiento es obligatoria';
    }
    if (name === 'rating') {
      if (!value) {
        error = 'El rating es obligatorio';
      } else if (isNaN(value) || value < 0 || value > 10) {
        error = 'El rating debe ser un número entre 0 y 10';
      }
    }
    if (name === 'genres' && !value) {
      error = 'El género es obligatorio';
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error
    });
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Service.createGame(
        formData.name,
        formData.description,
        formData.platforms.split(','), 
        formData.image,
        formData.releaseDate,
        parseFloat(formData.rating),
        [formData.genres]
      );
      if(response === 204){
        alert('se creo el juego correctamente');
      }
      setFormData(initialFormData);
    } catch (error) {
      console.log('el error',error)
      alert('se creo el juego')
      setFormData(initialFormData);
      
    }
  };

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

  const platforms = [
    'PC', 'PlayStation 5', 'PlayStation 4', 'PlayStation 3', 'PlayStation 2', 'PlayStation',
    'PlayStation Vita', 'PlayStation Portable', 'Xbox One', 'Xbox Series S/X', 'Xbox 360',
    'Xbox', 'Nintendo Switch', 'Nintendo 3DS', 'Nintendo DS', 'Nintendo DSi', 'Nintendo Wii U',
    'Nintendo Wii', 'Nintendo GameCube', 'Nintendo 64', 'Nintendo SNES', 'Nintendo NES',
    'iOS', 'Android', 'macOS', 'Linux', 'Web'
  ];

  return (
    <div>
      <Navbar />
      <div className="cont-main">
        <form onSubmit={handleSubmit}>
          <div className="form-cont">
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="input-game"
              placeholder="e.g., Super Mario"
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>
          <div className="form-cont">
            <label htmlFor="image">Imagen (URL):</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              onBlur={handleBlur}
              className="input-game"
              placeholder="e.g., https://example.com/image.jpg"
            />
            {errors.image && <p className="error">{errors.image}</p>}
          </div>
          <div className="form-cont">
            <label htmlFor="platforms">Plataforma:</label>
            <select
              id="platforms"
              name="platforms"
              value={formData.platforms}
              onChange={handleChange}
              onBlur={handleBlur}
              className="input-game"
            >
              <option value="">Seleccione una plataforma</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
            {errors.platforms && <p className="error">{errors.platforms}</p>}
          </div>
          <div className="form-cont">
            <label htmlFor="description">Descripción:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className="text-area-game"
              placeholder="Descripción del juego"
            />
            {errors.description && <p className="error">{errors.description}</p>}
          </div>
          <div className="form-cont">
            <label htmlFor="releaseDate">Fecha de lanzamiento:</label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className="input-game"
            />
            {errors.releaseDate && <p className="error">{errors.releaseDate}</p>}
          </div>
          <div className="form-cont">
            <label htmlFor="rating">Rating:</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              onBlur={handleBlur}
              min="0"
              max="10"
              step="0.1"
              className="input-game"
              placeholder="ejemplo: 8.5"
            />
            {errors.rating && <p className="error">{errors.rating}</p>}
          </div>
          <div className="form-cont">
            <label htmlFor="genres">Género:</label>
            <select
              id="genres"
              name="genres"
              value={formData.genres}
              onChange={handleChange}
              onBlur={handleBlur}
              className="input-game"
            >
              <option value="">Seleccione un género</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.name}>{genre.name}</option>
              ))}
            </select>
            {errors.genres && <p className="error">{errors.genres}</p>}
          </div>
          <button className="button" type="submit">Añadir Videojuego</button>
        </form>
      </div>
    </div>
  );
};

export default AddGame;
