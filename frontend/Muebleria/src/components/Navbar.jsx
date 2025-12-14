// src/components/Navbar.jsx

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { EstaturaContext } from './EstaturaContext'; 
import "./Navbar.css";

export default function Navbar() {
    const { estatura } = useContext(EstaturaContext);
    const [busqueda, setBusqueda] = useState("");
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const navRef = useRef(null);
    const catalogRef = useRef(null);

    const manejarSubmit = (e) => {
        e.preventDefault();
        if (busqueda.trim() !== "") {
            if (!estatura) {
                navigate("/estatura");
            } else {
                navigate(`/catalogo?search=${busqueda}`);
            }
            setBusqueda("");
        }
    };

    const navegarACatalogo = (categoria) => {
        setIsCatalogOpen(false);
        if (!estatura) {
            navigate("/estatura");
            return;
        }

        if (categoria === "todos") {
            navigate("/catalogo");
        } else {
            navigate(`/catalogo?categoria=${categoria}`);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (catalogRef.current && !catalogRef.current.contains(event.target)) {
                setIsCatalogOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const isItemActive = (path) => {
        if (path === "/catalogo") {
            return location.pathname.includes("catalogo");
        }
        return location.pathname === path;
    };
    
    const handleEstaturaClick = () => {
        if (estatura === null) {
            navigate("/estatura");
        }
    }

    return (
        <div className="navbar-wrapper">
            <div className="container">
                
                {/* 1. LOGO */}
                <Link to="/" className="navbar-logo">
                    <h2>SOMA</h2>
                </Link>

                {/* 2. MENÚ DE NAVEGACIÓN */}
                <nav className="navbar-menu">
                    <ul className="menu-list" ref={navRef}>
                        <li className={`menu-item ${isItemActive("/") ? "active" : ""}`}>
                            <Link to="/" className="menu-link">
                                <span className="nav-text">Inicio</span>
                                <span className="underline"></span>
                            </Link>
                        </li>

                        <li 
                            className={`menu-item ${isItemActive("/catalogo") ? "active" : ""}`}
                            ref={catalogRef}
                            onMouseEnter={() => setIsCatalogOpen(true)}
                            onMouseLeave={() => setIsCatalogOpen(false)}
                        >
                            <span 
                                className="menu-link catalog-trigger"
                                onClick={() => navegarACatalogo("todos")}
                            >
                                <span className="nav-text">Catálogo</span>
                                <span className="underline"></span>
                            </span>
                            
                            {/* DROPDOWN MENU */}
                            <div className={`dropdown-panel ${isCatalogOpen ? "active" : ""}`}>
                                <div className="dropdown-column">
                                    <div className="column-title">Categorias principales</div>
                                    <span className="dropdown-item" onClick={() => navegarACatalogo("5")}>Cocina</span>
                                    <span className="dropdown-item" onClick={() => navegarACatalogo("6")}>Baño</span>
                                    <span className="dropdown-item" onClick={() => navegarACatalogo("10")}>Habitación</span>
                                    <span className="dropdown-item" onClick={() => navegarACatalogo("11")}>Living & Comedor</span>
                                </div>
                                
                                <div className="dropdown-column">
                                    <div className="column-title">Otras Categorias</div>
                                    <span className="dropdown-item" onClick={() => navegarACatalogo("7")}>Exterior</span>
                                    <span className="dropdown-item" onClick={() => navegarACatalogo("9")}>Taller</span>
                                </div>
                                
                                <div className="dropdown-column">
                                    <div className="column-title">Te podría interesar</div>
                                    <span className="dropdown-item" onClick={() => navegarACatalogo("ofertas")}>Ofertas</span>
                                </div>
                            </div>
                        </li>

                        <li className={`menu-item ${isItemActive("/sobrenosotros") ? "active" : ""}`}>
                            <Link to="/sobrenosotros" className="menu-link">
                                <span className="nav-text">Sobre Nosotros</span>
                                <span className="underline"></span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* 3. BARRA DE BÚSQUEDA Y ESTATURA */}
                <div className="navbar-actions">
                    <div className="search-box">
                        <form onSubmit={manejarSubmit}>
                            <input 
                                type="text" 
                                className="search-input" 
                                placeholder="Buscar..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                            <button type="submit" className="search-btn">
                                <i className="fas fa-search"></i>
                            </button>
                        </form>
                    </div>

                    <div className="estatura-btn" onClick={handleEstaturaClick}>
                        <i className="fas fa-ruler-vertical"></i>
                        <span className="estatura-text">
                            {estatura !== null ? `${estatura}m` : 'Ingresar'}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}