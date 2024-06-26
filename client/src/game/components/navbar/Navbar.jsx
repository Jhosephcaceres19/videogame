import React, { useState } from 'react';
import './Navbar.css';
import Service from '../../service/Service';
import { ButtonAddGames } from '../button/ButtonAddGames';
import { Link } from 'react-router-dom';

export const Navbar = ({ setGames, setSearchTerm }) => {

  return (
    <nav className='nav-main'>
      <div>
        <Link to={'/'} className='text-nav'>Video - Game</Link>
      </div>
      <div className='input-nav'>
        <Link to={'/home'} className='text-nav'>Home</Link>
        <ButtonAddGames />
      </div>
    </nav>
  );
};
