import React from "react";
import { Link } from "react-router-dom";
import './ButtonAddGames.css'

export const ButtonAddGames = () => {
  return (
    <Link to="/addgame" className="juego">
      Agregar Juego
    </Link>
  );
};
