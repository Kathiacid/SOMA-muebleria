import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EstaturaContext } from "./EstaturaContext";
import "./BotonEstaturaFlotante.css";

const BotonEstaturaFlotante = () => {
  const { estatura } = useContext(EstaturaContext);
  const navigate = useNavigate();

  return (
    <div
      className="floating-estatura-btn"
      onClick={() => navigate("/estatura")}
      role="button"
      tabIndex={0}
      aria-label={estatura ? `Cambiar estatura. Actual: ${estatura} metros` : "Ingresar estatura"}
    >
      <img src="/contorno.png" alt="Icono de medida" />
      <span>
        {estatura ? `${estatura} m` : 'ESTATURA'}
      </span>
    </div>
  );
};

export default BotonEstaturaFlotante;
