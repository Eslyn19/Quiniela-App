import React from "react";
import "../css/componentsCSS/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-legal">
        Quiniela Copa del Mundo 2026 es una plataforma educativa de predicciones deportivas desarrollada para el
        curso de Bases de Datos. Simula un sistema de apuestas con temática exclusiva de la Copa del Mundo FIFA 2026.
        Eres responsable de determinar la legalidad del juego en línea en tu jurisdicción.
      </p>
      <p className="footer-gamble">
        SI TIENES UN PROBLEMA CON EL JUEGO EN LÍNEA, LLAMA AL <strong>1-800-GAMBLER</strong>.
      </p>
      <div className="footer-divider" />
      <div className="footer-bottom">
        <span>Quiniela Copa del Mundo FIFA 2026</span>
        <span className="footer-dot">·</span>
        <span>© 2026 Proyecto Bases de Datos — UNA</span>
      </div>
    </footer>
  );
};

export default Footer;