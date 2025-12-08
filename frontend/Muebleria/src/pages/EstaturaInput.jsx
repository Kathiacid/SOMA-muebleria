// src/pages/EstaturaInput.jsx
import { useContext, useState, useRef } from "react"; 
import { EstaturaContext } from "../components/EstaturaContext"; 
import { useNavigate } from "react-router-dom";
import "./estaturaInput.css";

const EstaturaInput = () => {
    const { estatura, setEstatura, resetEstatura } = useContext(EstaturaContext);
    const [valorEstatura, setValorEstatura] = useState("");
    const [warning, setWarning] = useState("");
    const navigate = useNavigate();
    const liveAvatarRef = useRef(null); 
    const applyStatureEffect = (statureMeters) => {
        const avatar = liveAvatarRef.current;
        if (!avatar) return;

        const statureCmAdjusted = statureMeters * 100;

        const minStature = 100; 
        const maxStature = 250;
        

        const scaleFactor = 0.7 + (statureCmAdjusted - minStature) / (maxStature - minStature) * 0.6;
        
        avatar.style.transform = `scaleY(${scaleFactor})`;
    };


    const handleInput = (e) => {
        const valor = e.target.value;
        
        const limpio = valor.replace(/,/g, '.').replace(/[^0-9.]/g, ''); 
        

        const partes = limpio.split('.');
        let valorAjustado;
        if (partes.length > 2) {
            valorAjustado = partes[0] + '.' + partes.slice(1).join('');
        } else {
            valorAjustado = limpio;
        }
        setValorEstatura(valorAjustado);

        const altura = parseFloat(valorAjustado);

        if (isNaN(altura) || altura === 0) {
            setWarning("");

            if (liveAvatarRef.current) {
                liveAvatarRef.current.style.transform = `scaleY(1)`;
            }
            return;
        }

        applyStatureEffect(altura); 


        if (altura < 1.0) {
            setWarning("⚠️ La estatura mínima para esta experiencia es de 1.0 metros.");
        } else if (altura > 2.5) {
            setWarning("⚠️ La estatura máxima permitida es de 2.5 metros.");
        } else {
            setWarning("");
        }
    };

    const handleGuardar = () => {
        const altura = parseFloat(valorEstatura);

        if (isNaN(altura) || altura < 1.0 || altura > 2.5) {
            alert("Por favor, ingrese una estatura válida entre 1.0 y 2.5 metros.");
            return;
        }

        const card = document.querySelector('.card-soma-input');
        if (card) {
            card.classList.add('animate-out-zoom');
        }

        setTimeout(() => {
            setEstatura(altura);
            navigate("/catalogo");
        }, 700); 
    };

    const handleReset = () => {
        resetEstatura();
        navigate("/");
    };

    return (
        <div className="soma-container-full futuristic-background-soma">
            
            <div className="card-soma-input fade-in-soma">
                
                <h1 className="title-soma-glow">
                    <span className="logo-text-soma">SOMA</span> Experience
                </h1>
                
                <p className="subtitle-soma-welcome slide-up-soma">
                    Bienvenido a una nueva perspectiva. <br/>
                    Ingresa tu estatura (metros) para personalizar tu vista.
                </p>
                
                <div className="live-visualizer-area slide-up-soma" style={{animationDelay: '0.2s'}}>
                    <div className="reference-line"></div>
                    <div ref={liveAvatarRef} className="live-avatar">
                        <span>🧍</span></div>
                    
                </div>

                <div className="stature-input-group slide-up-soma" style={{animationDelay: '0.7s'}}>
                    <input
                        className="stature-input-field" 
                        type="text" 
                        placeholder="Estatura en metros (ej: 1.75)"
                        value={valorEstatura}
                        onChange={handleInput}
                        onFocus={(e) => e.target.classList.add('focused-glow')}
                        onBlur={(e) => e.target.classList.remove('focused-glow')}
                    />
                    <span className="input-unit">MTS</span> 
                </div>

                {warning && <p className="warning-text-soma">{warning}</p>}
                <button 
                    onClick={handleGuardar} 
                    className="button-enter-soma scale-in-soma" 
                    disabled={!!warning || !valorEstatura || isNaN(parseFloat(valorEstatura))}
                    style={{animationDelay: '1.2s'}}
                >
                    {estatura ? "Actualizar y Entrar" : "Entrar a SOMA"}
                    <span className="icon-portal">→</span>
                </button>
                {estatura && (
                    <button 
                        onClick={handleReset} 
                        className="reset-button-soma"
                    >
                        Resetear Estatura ({estatura}m)
                    </button>
                )}
            </div>
        </div>
    );
};

export default EstaturaInput;