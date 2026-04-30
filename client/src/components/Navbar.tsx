import React, { useContext } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Database } from 'lucide-react';

const AppNavbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar 
            className="sticky-top border-b border-white/5 bg-transparent backdrop-blur-md" 
            expand="lg"
            variant="dark"
        >
            <Container className="position-relative d-flex">
                <div className="me-auto d-none d-lg-block"></div>
                
                <Navbar.Brand 
                    onClick={() => navigate('/')} 
                    style={{ cursor: 'pointer' }}
                    className="fw-bold text-white fs-4 transition-all hover:text-blue-400 drop-shadow-md d-flex align-items-center gap-2"
                >
                    <style>
                        {`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@800&display=swap');`}
                    </style>
                    <Database className="w-5 h-5 text-cyan-400" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 tracking-wider" style={{ fontFamily: '"Orbitron", sans-serif' }}>
                        DBMS QUORA
                    </span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-white/20 ms-auto position-relative z-10" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        {user ? (
                            <>
                                <span className="me-3 text-neutral-300">
                                    Hi, <span className="text-white fw-bold">{user.username}</span>
                                </span>
                                <Button 
                                    variant="outline-light" 
                                    size="sm" 
                                    className="border-white/20 hover:bg-white/10"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link 
                                    className="text-neutral-300 hover:text-white me-2"
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </Nav.Link>
                                <Button 
                                    size="sm"
                                    className="bg-gradient-to-r from-blue-600 to-cyan-500 border-0 shadow-lg shadow-blue-500/20"
                                    onClick={() => navigate('/signup')}
                                >
                                    Signup
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
