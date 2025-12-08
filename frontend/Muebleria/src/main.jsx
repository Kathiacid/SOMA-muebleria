// src/main.jsx
import React, { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import { EstaturaProvider } from "./components/EstaturaContext"
import Navbar from "./components/Navbar"
import Home from "./pages/Home" 
import EstaturaInput from "./pages/EstaturaInput" 
import Catalogo from "./pages/Catalogo"
import ScrollToTop from './components/ScrollToTop';
import DetalleProducto from "./pages/ProductoDetalle"
import SobreNosotros from "./pages/SobreNosotros"
import BotonEstaturaFlotante from "./components/BotonEstaturaFlotante"; 

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        <EstaturaProvider>
            <BrowserRouter>
                <ScrollToTop />
                <Navbar />
                <BotonEstaturaFlotante />  
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/estatura" element={<EstaturaInput />} />
                    <Route path="/catalogo" element={<Catalogo />} />
                    <Route path="/producto/:id" element={<DetalleProducto />} />
                    <Route path="/sobrenosotros" element={<SobreNosotros />} />
                </Routes>
            </BrowserRouter>
        </EstaturaProvider>
    </StrictMode>
);