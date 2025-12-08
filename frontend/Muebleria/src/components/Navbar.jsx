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
        } else {
        }
    }


    return (
        <header className="header">
            <div className="header-main">
                <div className="container">
                    <Link to="/" className="header-logo">
                        <h2>SOMA</h2>
                    </Link>

                    <nav className="desktop-navigation-menu">
                        <ul className="desktop-menu-category-list" ref={navRef}>
                            <li className={`menu-category ${isItemActive("/") ? "active" : ""}`}>
                                <Link to="/" className="menu-title">
                                    <span className="nav-text">Inicio</span>
                                    <span className="underline-right"></span>
                                </Link>
                            </li>

                            <li 
                                className={`menu-category ${isItemActive("/catalogo") ? "active" : ""}`}
                                ref={catalogRef}
                                onMouseEnter={() => setIsCatalogOpen(true)}
                                onMouseLeave={() => setIsCatalogOpen(false)}
                            >
                                
                                <span 
                                    className="menu-title catalog-trigger"
                                    onClick={() => navegarACatalogo("todos")}
                                >
                                    <span className="nav-text">Catálogo</span>
                                    <span className="underline-right"></span>
                                </span>
                                
                                
                                <div className={`dropdown-panel ${isCatalogOpen ? "active" : ""}`}>
                                    
                                    
                                    <div className="dropdown-panel-list">
                                        <div className="menu-title">
                                            <span >
                                                Categorias principales
                                            </span>
                                        </div>

                                        
                                        <div className="panel-list-item">
                                            <span onClick={() => navegarACatalogo("5")}>
                                                Cocina
                                            </span>
                                        </div>
                                        <div className="panel-list-item">
                                            <span onClick={() => navegarACatalogo("6")}>
                                                Baño
                                            </span>
                                        </div>
                                        <div className="panel-list-item">
                                            <span onClick={() => navegarACatalogo("10")}>
                                                Habitación
                                            </span>
                                        </div>
                                        <div className="panel-list-item">
                                            <span onClick={() => navegarACatalogo("11")}>
                                                Living & Comedor
                                            </span>
                                        </div>
                                    </div>

                                    
                                    <div className="dropdown-panel-list">
                                        <div className="menu-title">
                                            <span >
                                                Otras Categorias
                                            </span>
                                        </div>
                                        
                                        <div className="panel-list-item">
                                            <span onClick={() => navegarACatalogo("7")}>
                                                Exterior
                                            </span>
                                        </div>
                                        
                                        <div className="panel-list-item">
                                            <span onClick={() => navegarACatalogo("9")}>
                                                Taller
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="dropdown-panel-list">
                                        <div className="menu-title">
                                            <span>Te podría interesar</span>
                                        </div>
                                        <div className="panel-list-item">
                                            <span onClick={() => navegarACatalogo("ofertas")}>
                                                Ofertas
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li className={`menu-category ${isItemActive("/sobrenosotros") ? "active" : ""}`}>
                                <Link to="/sobrenosotros" className="menu-title">
                                    <span className="nav-text">Sobre Nosotros</span>
                                    <span className="underline-right"></span>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    
                    <div className="header-search-container">
                        <form onSubmit={manejarSubmit}>
                            <input 
                                type="text" 
                                className="search-field" 
                                placeholder="Buscar productos..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                            <button type="submit" className="search-btn">
                                <i className="fas fa-search"></i>
                            </button>
                        </form>
                    </div>

                    
                    <div className="altura-navbar" onClick={handleEstaturaClick}>
                        <i className="fas fa-ruler-vertical"></i>
                        <strong className="estatura-resaltada">
                            {estatura !== null ? `${estatura}m` : 'Ingresar'}
                        </strong>
                    </div>
                    
                </div>
            </div>
        </header>
    );
}