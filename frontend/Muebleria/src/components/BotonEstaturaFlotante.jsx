import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EstaturaContext } from "./EstaturaContext";
import "./BotonEstaturaFlotante.css"; 

const FloatingEstaturaButton = () => {
const { estatura } = useContext(EstaturaContext);
const navigate = useNavigate();

if (!estatura) return null;

return (
<div
    className="floating-estatura-btn"
    onClick={() => navigate("/estatura")}
>
    <img src='/contorno.png' alt="Contorno de estatura" />
    <span className="tooltip">Cambiar estatura</span>
</div>
);
};

export default FloatingEstaturaButton;
