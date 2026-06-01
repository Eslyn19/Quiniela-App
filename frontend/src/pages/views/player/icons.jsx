const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' };
const ico = (children) => <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>{children}</svg>;

export const IcoBets = () => ico(<>
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
</>);

export const IcoRanking = () => ico(<>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
</>);

export const IcoLogout = () => ico(<>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
</>);

export const IcoChevron = ({ down }) => ico(
    down
        ? <polyline points="6 9 12 15 18 9"/>
        : <polyline points="18 15 12 9 6 15"/>
);

export const IcoCheck = () => ico(<>
    <polyline points="20 6 9 17 4 12"/>
</>);

export const IcoStar = () => ico(<>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
</>);

export const IcoTeams = () => ico(<>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
</>);

export const IcoMail = () => ico(<>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
</>);

export const IcoStore = () => ico(<>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
</>);

export const IcoPlanet = () => ico(<>
    <circle cx="12" cy="12" r="5"/>
    <path d="M4 9.5C6 7 9 5.5 12 5.5s6 1.5 8 4"/>
    <path d="M4 14.5C6 17 9 18.5 12 18.5s6-1.5 8-4"/>
</>);
