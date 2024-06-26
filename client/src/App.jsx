import React from "react";
import { Link } from "react-router-dom";
import "./App.css";

const App = () => {
  return (
    <div className="main-app">
      <h1>VIDEO-GAME</h1>
      <Link to="/home" className="app-button">
        <h3>Ingresar</h3>
      </Link>
    </div>
  );
};

export default App;
