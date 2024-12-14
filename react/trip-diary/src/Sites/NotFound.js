import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/NotFound.css'; // Stylování komponenty

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">Oops! Stránka, kterou hledáte, neexistuje.</p>
        <button
          className="not-found-button"
          onClick={() => navigate('/')}
        >
          Zpět na hlavní stránku
        </button>
      </div>
      <div className="not-found-animation">
        {/* Tady můžete přidat SVG animaci, obrázek nebo cokoliv chcete */}
        <img
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
          alt="Page Not Found"
          className="not-found-image"
        />
      </div>
    </div>
  );
};

export default NotFound;
