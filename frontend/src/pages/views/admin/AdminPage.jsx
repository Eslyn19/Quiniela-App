import Dock from '../../../components/Dock';
import StarBorder from '../../../components/StarBorder';
import MagicRings from '../../../components/MagicRings';
import LoadingScreen from '../../../components/LoadingScreen';
import { AdminProvider, useAdmin } from '../../../contexts/AdminContext';
import SeccionUsuarios from './SeccionUsuarios';
import SeccionApuestas from './SeccionApuestas';
import SeccionPuntuaciones from './SeccionPuntuaciones';
import SeccionResultados from './SeccionResultados';
import SeccionPremios from './SeccionPremios';
import '../../../css/pagesCSS/Admin.css';
// Iconos
import { 
    IcoUsers, 
    IcoBet, 
    IcoScore,
    IcoLogout, 
    IcoResultado, 
    IcoGift 
} from './icons';

const secciones = {
    usuarios: SeccionUsuarios,
    apuestas: SeccionApuestas,
    puntuaciones: SeccionPuntuaciones,
    resultados: SeccionResultados,
    premios: SeccionPremios,
};

/* Panel principal de admin donde se contiene todo el dashboard y 
   se maneja la navegación entre secciones. Solo accesible para admins. */
export default function AdminPage() {
    return (
        <AdminProvider>
            <AdminDashboard />
        </AdminProvider>
    );
}

function AdminDashboard() {
    const { 
      admin, 
      loading, 
      seccion, 
      setSeccion, 
      logout 
    } = useAdmin();

    if (loading){
        return <LoadingScreen message="Verificando acceso..." />;
    }
    const SeccionActiva = secciones[seccion];
    
    // Agregar imagenes y rutas a los items del dock, y marcar el item activo con una clase CSS
    const dockItems = [
        { label: 'Usuarios', icon: <IcoUsers />, onClick: () => setSeccion('usuarios'), className: seccion === 'usuarios' ? 'dock-active' : '' },
        { label: 'Apuestas', icon: <IcoBet />, onClick: () => setSeccion('apuestas'), className: seccion === 'apuestas' ? 'dock-active' : '' },
        { label: 'Puntuaciones', icon: <IcoScore />, onClick: () => setSeccion('puntuaciones'), className: seccion === 'puntuaciones' ? 'dock-active' : '' },
        { label: 'Resultados', icon: <IcoResultado />, onClick: () => setSeccion('resultados'), className: seccion === 'resultados' ? 'dock-active' : '' },
        { label: 'Premios', icon: <IcoGift />, onClick: () => setSeccion('premios'), className: seccion === 'premios' ? 'dock-active' : '' },
        { label: 'Cerrar sesión', icon: <IcoLogout />, onClick: logout, className: 'dock-logout' },
    ];

    return (
      <div className="admin-page">
          <div className="admin-bg-rings">
              <MagicRings
                  color="#909090"
                  colorTwo="#c5c5c5"
                  ringCount={6}
                  speed={0.5}
                  attenuation={10}
                  lineThickness={1}
                  baseRadius={0.35}
                  radiusStep={0.1}
                  scaleRate={0.1}
                  opacity={1}
                  noiseAmount={0.1}
                  rotation={0}
                  ringGap={1.5}
                  fadeIn={0.7}
                  fadeOut={0.5}
                  followMouse={false}
                  mouseInfluence={0.2}
                  hoverScale={1.2}
                  parallax={0.05}
                  clickBurst={false}
              />
          </div>

        <header className="admin-dock-header">
            {/* Lado superior izquierdo*/}
            <StarBorder as="div" className="admin-badge-border" color="magenta" speed="2s">
               Admin
              </StarBorder>
            <Dock items={dockItems} panelHeight={60} magnification={76} baseItemSize={46} distance={140} />
            {/* Lado superior derecho */}
            <StarBorder as="div" className="admin-whoami-border" color="cyan" speed="2s">
               {admin?.username}
            </StarBorder>
        </header>

        <main className="admin-main">
            <SeccionActiva />
        </main>
      </div>
    );
}
