import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../css/componentsCSS/Header.css";
import mexicoFlag from "../assets/mexico.png";
import canadaFlag from "../assets/canada.png";
import usaFlag from "../assets/usa.png";

const sedes = [
  { name: "USA",    flag: usaFlag },
  { name: "México", flag: mexicoFlag },
  { name: "Canadá", flag: canadaFlag },
];

const GRUPOS = [
  { letra: 'A', color: '#ef4444', equipos: ['Mexico',       'Sudafrica',      'Corea del Sur', 'Chequia']      },
  { letra: 'B', color: '#f97316', equipos: ['Canada',       'Bosnia-Herzegovina', 'Qatar',   'Suiza']          },
  { letra: 'C', color: '#f59e0b', equipos: ['Brasil',       'Marruecos',    'Haiti',         'Escocia']        },
  { letra: 'D', color: '#22c55e', equipos: ['Estados Unidos','Paraguay',    'Australia',     'Turquia']        },
  { letra: 'E', color: '#10b981', equipos: ['Alemania',     'Curacao',      'Costa de Marfil','Ecuador']       },
  { letra: 'F', color: '#06b6d4', equipos: ['Paises Bajos', 'Japon',        'Suecia',        'Tunez']          },
  { letra: 'G', color: '#3b82f6', equipos: ['Belgica',      'Egipto',       'Iran',          'Nueva Zelanda']  },
  { letra: 'H', color: '#6366f1', equipos: ['Espana',       'Cabo Verde',   'Arabia Saudita','Uruguay']        },
  { letra: 'I', color: '#8b5cf6', equipos: ['Francia',      'Senegal',      'Iraq',          'Noruega']        },
  { letra: 'J', color: '#d946ef', equipos: ['Argentina',    'Argelia',      'Austria',       'Jordania']       },
  { letra: 'K', color: '#ec4899', equipos: ['Portugal',     'Congo Rep. Dem.','Uzbekistan',  'Colombia']       },
  { letra: 'L', color: '#fb923c', equipos: ['Inglaterra',   'Croacia',      'Ghana',         'Panama']         },
];

const Header = () => {
  const [gruposOpen, setGruposOpen] = useState(false);
  const headerRef   = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!gruposOpen) return;
    const handler = (e) => {
      const inHeader   = headerRef.current?.contains(e.target);
      const inDropdown = dropdownRef.current?.contains(e.target);
      if (!inHeader && !inDropdown) setGruposOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [gruposOpen]);

  return (
    <>
      <header className="header" ref={headerRef}>
        <div className="header-group-left">
          <div className="header-left">
            <Link to="/" style={{ textDecoration: "none" }}><span>Inicio</span></Link>
            <Link to="/login" style={{ textDecoration: "none" }}><span>Apostar</span></Link>
            <Link to="/ranking" style={{ textDecoration: "none" }}><span>Ranking</span></Link>
            <Link to="/login" style={{ textDecoration: "none" }}><span>Pronosticos</span></Link>
            <span
              className={gruposOpen ? 'active' : ''}
              onClick={() => setGruposOpen(v => !v)}
            >
              Grupos
            </span>
          </div>
        </div>

        <div className="header-center-wc">
          <div className="wc-badge">
            <div className="wc-badge-text">
              <span className="wc-title">FWC 2026</span>
            </div>
            <div className="wc-sedes">
              {sedes.map(s => (
                <img key={s.name} src={s.flag} alt={s.name} className="wc-sede-flag" title={s.name} draggable={false} />
              ))}
            </div>
          </div>
        </div>

        <div className="header-right">
          <Link to="/login" style={{ textDecoration: "none" }}>
            <span className="spansLinks">Iniciar Sesion</span>
          </Link>
          <Link to="/register" style={{ textDecoration: "none" }}>
            <button className="btn-join">Registrarse</button>
          </Link>
        </div>
      </header>

      {gruposOpen && (
        <div className="grupos-dropdown" ref={dropdownRef}>
          <div className="grupos-title-bar">
          </div>
          <div className="grupos-grid">
            {GRUPOS.map((g, gi) => (
              <div key={g.letra} className="grupo-card" style={{ '--gc': g.color }}>
                <div className="grupo-top-bar" style={{ background: g.color, boxShadow: `0 10px 10px ${g.color}99` }} />
                <div className="grupo-body">
                  <div className="grupo-header">
                    <div className="grupo-label-wrap">
                      <span className="grupo-code">Grupo</span>
                      <span className="grupo-letra" style={{ color: g.color }}>{g.letra}</span>
                    </div>
                    <span className="grupo-index">{String(gi + 1).padStart(2, '0')}</span>
                  </div>
                  <ul className="grupo-equipos">
                    {g.equipos.map((eq, i) => (
                      <li key={eq}>
                        <span className="eq-num" style={{ color: g.color }}>{i + 1}</span>
                        <span className="eq-name">{eq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
