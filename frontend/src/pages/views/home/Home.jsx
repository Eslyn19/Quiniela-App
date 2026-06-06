import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../../css/pagesCSS/Home.css";
import FloatingLines from "../../../components/FloatingLines";
import LoadingScreen from "../../../components/LoadingScreen";

import sqlServerImg from "../../../assets/sql-server.png";
import nodejsImg from "../../../assets/node.png";
import reactImg from "../../../assets/react.png";
import balonImg from "../../../assets/balon.png";
import copaImg from "../../../assets/copa.png";

import { TIPOS_PUNT, carouselSports, testimonials } from "./homeData";

function TipoCard({ tipo }) {
  return (
    <div className="tipo-card" style={{ "--card-color": tipo.color }}>
      <div className="tipo-icon">
        <img src={tipo.imagen} alt={tipo.nombre} draggable={false} />
      </div>
      <p className="tipo-nombre">{tipo.nombre}</p>
      <p className="tipo-desc">{tipo.desc}</p>
    </div>
  );
}

function SportItem({ sport }) {
  return (
    <div className="sport-item" style={{ "--sport-color": sport.color }} title={`Grupo ${sport.grupo} — ${sport.name}`}>
      <div className="sport-circle">
        <img src={sport.svg} alt={sport.name} className="sport-svg" draggable={false} />
      </div>
    </div>
  );
}

function TestimonialRow({ testimonio, index }) {
  return (
    <div className="testimonial-row" data-aos="fade-up" data-aos-delay={index * 80}>
      <div className="testimonial-avatar">
        {testimonio.country} <strong>{testimonio.name}</strong>
      </div>
      <p className="testimonial-text">"{testimonio.text}"</p>
      <div className="testimonial-stars">
        {"★".repeat(testimonio.stars)}{"☆".repeat(5 - testimonio.stars)}
      </div>
    </div>
  );
}

function BetRow({ bet, index }) {
  return (
    <div className={`bet-row ${bet.hot ? "hot" : ""}`} data-aos="fade-up" data-aos-delay={index * 80}>
      <div className="bet-left">
        {bet.hot && <span className="hot-badge">🔥 Popular</span>}
        <div className="bet-tipo">
          <span className="bet-tipo-icon">{bet.icon}</span>
          <span className="bet-tipo-text">{bet.tipo}</span>
          <span className="bet-liga-badge">{bet.liga}</span>
        </div>
        <span className="bet-match">{bet.match}</span>
      </div>
      <div className="bet-right">
        <div className="bet-pred-block">
          <span className="bet-pred-label">Pronóstico</span>
          <span className="bet-pred-value">{bet.pred}</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [fadeOut, setFadeOut] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 2100);
    const t2 = setTimeout(() => {
      setShowLoader(false);
      AOS.init({ duration: 700, once: true, easing: "ease-out-cubic", offset: 80 });
      AOS.refresh();
    }, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <>
      {showLoader && <LoadingScreen fadeOut={fadeOut} />}
      <div className="home">

        <div className="home-galaxy">
          <FloatingLines

linesGradient={["#0f3d1f", "#1a6b3a", "#4a5a6a"]}
            enabledWaves={["top", "middle", "bottom"]}
            lineCount={8}
            lineDistance={8}
            bendRadius={8}
            bendStrength={-2}
            interactive
            parallax={true}
            animationSpeed={1}
          />
        </div>

        <section className="tipos-punt-section">
          <div className="tipos-punt-header">
            <span className="tipos-punt-label">SISTEMA DE PUNTUACIÓN</span>
            <h3 className="tipos-punt-title">¿Cómo ganar puntos?</h3>
          </div>
          <div className="tipos-punt-grid">
            {TIPOS_PUNT.map((t, i) => <TipoCard key={i} tipo={t} />)}
          </div>
        </section>

        <section id="sec-selecciones" className="carousel-section" aria-label="Selecciones Copa del Mundo 2026">
          <div className="carousel-track">
            {carouselSports.map((s, i) => <SportItem key={i} sport={s} />)}
          </div>
        </section>

        <section id="sec-sobre" className="section about-section">
          <div className="about-centered" data-aos="fade-up" data-aos-offset="0">
            <span className="tipos-punt-label">PROYECTO ACADÉMICO</span>
            <h2>Quiniela Copa del Mundo 2026</h2>
            <p>
              Plataforma de quinielas desarrollada para el curso de <strong>Bases de Datos</strong>, con temática
              exclusiva de la <strong>Copa del Mundo FIFA 2026</strong>, organizada en México, Canadá y Estados Unidos.
              Aplica conceptos avanzados de diseño relacional, procedimientos almacenados y gestión de usuarios.
            </p>
            <p>
              Registrate, predice los marcadores de los 64 partidos del torneo y acumula puntos para escalar
              en el ranking. Los administradores gestionan eventos, ingresan resultados y configuran los
              parámetros de puntuación directamente desde el panel de control.
            </p>
            <div className="about-tags">
              <img src={sqlServerImg} alt="SQL Server" />
              <img src={nodejsImg} alt="Node.js" />
              <img src={reactImg} alt="React" />
              <img src={balonImg} alt="Balón" />
              <img src={copaImg} alt="Copa del Mundo" />
            </div>
          </div>
        </section>

        <section id="sec-testimonios" className="section testimonials-section">
          <div className="section-header" data-aos="fade-right">
            <h2>Testimonios</h2>
          </div>
          <div className="testimonials-list">
            {testimonials.map((t, i) => <TestimonialRow key={i} testimonio={t} index={i} />)}
          </div>
        </section>

      </div>
    </>
  );
}
