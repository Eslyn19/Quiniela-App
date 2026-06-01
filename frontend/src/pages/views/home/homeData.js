const TW  = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg';
const FLAG = (code) => `https://flagcdn.com/w40/${code}.png`;

export const TIPOS_PUNT = [
  {
    svg: `${TW}/1f3af.svg`,
    nombre: "Marcador Exacto",
    desc: "Predice el marcador final. Si aciertas exacto ganas base × multiplicador; si solo aciertas el ganador, ganas la base.",
    color: "#10b981",
  },
  {
    svg: `${TW}/2694.svg`,
    nombre: "Resultado",
    desc: "Victoria local, empate o victoria visitante. La forma más directa de apostar a un partido.",
    color: "#10b981",
  },
  {
    svg: `${TW}/26bd.svg`,
    nombre: "Primer Goleador",
    desc: "El equipo con más goles se considera el primer anotador. Sin goles en el partido aplica penalización.",
    color: "#10b981",
  },
  {
    svg: `${TW}/1f4ca.svg`,
    nombre: "Más / Menos Goles",
    desc: "¿Habrá más o menos de 2.5 goles totales? Acierta el umbral correcto y suma puntos.",
    color: "#10b981",
  },
  {
    svg: `${TW}/1f3c6.svg`,
    nombre: "Ganador del Torneo",
    desc: "Predice el campeón final del torneo. El tipo más difícil y con mayor recompensa.",
    color: "#10b981",
  },
];

// Colores por grupo (A–L)
const G = {
  A: "#1a4d2e",
  B: "#1a2a4d",
  C: "#4d1a2a",
  D: "#2e1a4d",
  E: "#4d3b1a",
  F: "#1a3d4d",
  G: "#4d1a1a",
  H: "#1a4d4d",
  I: "#2a4d1a",
  J: "#4d2a1a",
  K: "#1a1a4d",
  L: "#3d4d1a",
};

export const sports = [
  // ── Grupo A ──
  { id: 1,  grupo: 'A', name: "México",            svg: FLAG('mx'),     color: G.A },
  { id: 2,  grupo: 'A', name: "Sudáfrica",         svg: FLAG('za'),     color: G.A },
  { id: 3,  grupo: 'A', name: "Corea del Sur",     svg: FLAG('kr'),     color: G.A },
  { id: 4,  grupo: 'A', name: "Chequia",           svg: FLAG('cz'),     color: G.A },
  // ── Grupo B ──
  { id: 5,  grupo: 'B', name: "Canadá",            svg: FLAG('ca'),     color: G.B },
  { id: 6,  grupo: 'B', name: "Bosnia-Herz.",      svg: FLAG('ba'),     color: G.B },
  { id: 7,  grupo: 'B', name: "Qatar",             svg: FLAG('qa'),     color: G.B },
  { id: 8,  grupo: 'B', name: "Suiza",             svg: FLAG('ch'),     color: G.B },
  // ── Grupo C ──
  { id: 9,  grupo: 'C', name: "Brasil",            svg: FLAG('br'),     color: G.C },
  { id: 10, grupo: 'C', name: "Marruecos",         svg: FLAG('ma'),     color: G.C },
  { id: 11, grupo: 'C', name: "Haití",             svg: FLAG('ht'),     color: G.C },
  { id: 12, grupo: 'C', name: "Escocia",           svg: FLAG('gb-sct'), color: G.C },
  // ── Grupo D ──
  { id: 13, grupo: 'D', name: "Estados Unidos",    svg: FLAG('us'),     color: G.D },
  { id: 14, grupo: 'D', name: "Paraguay",          svg: FLAG('py'),     color: G.D },
  { id: 15, grupo: 'D', name: "Australia",         svg: FLAG('au'),     color: G.D },
  { id: 16, grupo: 'D', name: "Turquía",           svg: FLAG('tr'),     color: G.D },
  // ── Grupo E ──
  { id: 17, grupo: 'E', name: "Alemania",          svg: FLAG('de'),     color: G.E },
  { id: 18, grupo: 'E', name: "Curaçao",           svg: FLAG('cw'),     color: G.E },
  { id: 19, grupo: 'E', name: "Costa de Marfil",   svg: FLAG('ci'),     color: G.E },
  { id: 20, grupo: 'E', name: "Ecuador",           svg: FLAG('ec'),     color: G.E },
  // ── Grupo F ──
  { id: 21, grupo: 'F', name: "Países Bajos",      svg: FLAG('nl'),     color: G.F },
  { id: 22, grupo: 'F', name: "Japón",             svg: FLAG('jp'),     color: G.F },
  { id: 23, grupo: 'F', name: "Suecia",            svg: FLAG('se'),     color: G.F },
  { id: 24, grupo: 'F', name: "Túnez",             svg: FLAG('tn'),     color: G.F },
  // ── Grupo G ──
  { id: 25, grupo: 'G', name: "Bélgica",           svg: FLAG('be'),     color: G.G },
  { id: 26, grupo: 'G', name: "Egipto",            svg: FLAG('eg'),     color: G.G },
  { id: 27, grupo: 'G', name: "Irán",              svg: FLAG('ir'),     color: G.G },
  { id: 28, grupo: 'G', name: "Nueva Zelanda",     svg: FLAG('nz'),     color: G.G },
  // ── Grupo H ──
  { id: 29, grupo: 'H', name: "España",            svg: FLAG('es'),     color: G.H },
  { id: 30, grupo: 'H', name: "Cabo Verde",        svg: FLAG('cv'),     color: G.H },
  { id: 31, grupo: 'H', name: "Arabia Saudita",    svg: FLAG('sa'),     color: G.H },
  { id: 32, grupo: 'H', name: "Uruguay",           svg: FLAG('uy'),     color: G.H },
  // ── Grupo I ──
  { id: 33, grupo: 'I', name: "Francia",           svg: FLAG('fr'),     color: G.I },
  { id: 34, grupo: 'I', name: "Senegal",           svg: FLAG('sn'),     color: G.I },
  { id: 35, grupo: 'I', name: "Iraq",              svg: FLAG('iq'),     color: G.I },
  { id: 36, grupo: 'I', name: "Noruega",           svg: FLAG('no'),     color: G.I },
  // ── Grupo J ──
  { id: 37, grupo: 'J', name: "Argentina",         svg: FLAG('ar'),     color: G.J },
  { id: 38, grupo: 'J', name: "Argelia",           svg: FLAG('dz'),     color: G.J },
  { id: 39, grupo: 'J', name: "Austria",           svg: FLAG('at'),     color: G.J },
  { id: 40, grupo: 'J', name: "Jordania",          svg: FLAG('jo'),     color: G.J },
  // ── Grupo K ──
  { id: 41, grupo: 'K', name: "Portugal",          svg: FLAG('pt'),     color: G.K },
  { id: 42, grupo: 'K', name: "Congo Rep. Dem.",   svg: FLAG('cd'),     color: G.K },
  { id: 43, grupo: 'K', name: "Uzbekistán",        svg: FLAG('uz'),     color: G.K },
  { id: 44, grupo: 'K', name: "Colombia",          svg: FLAG('co'),     color: G.K },
  // ── Grupo L ──
  { id: 45, grupo: 'L', name: "Inglaterra",        svg: FLAG('gb-eng'), color: G.L },
  { id: 46, grupo: 'L', name: "Croacia",           svg: FLAG('hr'),     color: G.L },
  { id: 47, grupo: 'L', name: "Ghana",             svg: FLAG('gh'),     color: G.L },
  { id: 48, grupo: 'L', name: "Panamá",            svg: FLAG('pa'),     color: G.L },
];

export const featuredBets = [
  { tipo: "Marcador Exacto",    icon: "🎯", hot: true,  match: "Argentina vs Francia",       liga: "Copa del Mundo 2026", pred: "2 — 1" },
  { tipo: "Resultado",          icon: "⚔️", hot: true,  match: "Brasil vs Alemania",         liga: "Copa del Mundo 2026", pred: "Victoria Local" },
  { tipo: "Primer Goleador",    icon: "⚽", hot: false, match: "España vs Inglaterra",       liga: "Copa del Mundo 2026", pred: "España" },
  { tipo: "Más / Menos Goles",  icon: "📊", hot: false, match: "México vs Estados Unidos",   liga: "Copa del Mundo 2026", pred: "Más de 2.5" },
  { tipo: "Ganador del Torneo", icon: "🏆", hot: true,  match: "Copa del Mundo 2026",        liga: "Copa del Mundo 2026", pred: "Brasil" },
];

export const testimonials = [
  { name: "Mishelle R.",  country: "🇲🇽", text: "Llevo apostando aquí desde que se anunció el Mundial 2026. La mejor quiniela en línea, entré y ya no puedo dejarlo.", stars: 5 },
  { name: "Andrés J.",    country: "🇨🇴", text: "Excelente app pero siempre que apuesto por Colombia en cuartos me arrepiento!", stars: 5 },
  { name: "Jhonny C.",    country: "🇵🇪", text: "Le recomendé la quiniela a mi suegra y ahora me cae bien. Algo hizo esta plataforma que la ciencia no pudo.", stars: 4 },
  { name: "Luis J.",      country: "🇵🇪", text: "Me fascina la interfaz gráfica. Tenía muchas deudas, ahora soy rico.", stars: 5 },
  { name: "Sebastian B.", country: "🇦🇷", text: "Aposté por Argentina como siempre, ganaron como siempre, cobré como siempre. La vida es bella siendo campeón del mundo. 🏆⭐", stars: 5 },
];

const CAROUSEL_REPEAT_PER_HALF = 3;
const carouselHalf = Array.from({ length: CAROUSEL_REPEAT_PER_HALF }, () => sports).flat();
export const carouselSports = [...carouselHalf, ...carouselHalf];
