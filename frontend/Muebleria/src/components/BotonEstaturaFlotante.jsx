import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EstaturaContext } from "./EstaturaContext";
// Importamos el CSS que define el estilo de "píldora"
import "./BotonEstaturaFlotante.css";

const BotonEstaturaFlotante = () => {
  // 1. Obtenemos el valor actual de la estatura del contexto global
  const { estatura } = useContext(EstaturaContext);
  
  // 2. Hook para navegar a la página de ingreso de estatura al hacer clic
  const navigate = useNavigate();

  return (
    /* Contenedor principal del botón flotante */
    <div
      className="floating-estatura-btn"
      onClick={() => navigate("/estatura")}
      // Mejoras de accesibilidad (opcional pero recomendado)
      role="button"
      tabIndex={0}
      aria-label={estatura ? `Cambiar estatura. Actual: ${estatura} metros` : "Ingresar estatura"}
    >
      {/* 3. La imagen que solicitaste. Asegúrate que 'contorno.png' esté en la carpeta 'public' */}
      <img src="/contorno.png" alt="Icono de medida" />

      {/* 4. Lógica del texto: Muestra la medida si existe, si no, la palabra "ESTATURA" */}
      <span>
        {estatura ? `${estatura} m` : 'ESTATURA'}
      </span>
    </div>
  );
};

export default BotonEstaturaFlotante;
