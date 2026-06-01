import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/views/home/Home';
import Login from './pages/auth/login/Login';
import Register from './pages/auth/register/Register';
import ResetPassword from './pages/auth/reset-password/ResetPassword';
import AdminPage from './pages/views/admin/AdminPage';
import PlayerPage from './pages/views/player/PlayerPage';
import RankingGlobal from './pages/views/home/RankingGlobal';
import ProtectedRoute from './components/ProtectedRoute';
import PlayerRoute from './components/PlayerRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <>
                        <Header />
                        <Home />
                        <Footer />
                    </>
                } />
                <Route path="/ranking" element={
                    <>
                        <Header />
                        <RankingGlobal />
                        <Footer />
                    </>
                } />
                <Route path="/login"          element={<Login />} />
                <Route path="/register"       element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/Admin"  element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
                <Route path="/Player" element={<PlayerRoute><PlayerPage /></PlayerRoute>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
