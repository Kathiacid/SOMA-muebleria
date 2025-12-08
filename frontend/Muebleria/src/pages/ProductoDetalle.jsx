import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { EstaturaContext } from '../components/EstaturaContext';
import { getProductoById, getPrecioAjustado, getCategorias, getProductosRelacionados } from "../api"; 
import axios from 'axios';
import './ProductoDetalle.css'; 
import ReCAPTCHA from 'react-google-recaptcha';

const ProductoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { estatura } = useContext(EstaturaContext);

    const recaptchaRef = useRef();

    const [producto, setProducto] = useState(null);
    const [precioCalculadoInfo, setPrecioCalculadoInfo] = useState(null); 
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [productosRelacionados, setProductosRelacionados] = useState([]); 
    const [showForm, setShowForm] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [formData, setFormData] = useState({
        nombre: '', email: '', telefono: '', cantidad: 1, ciudad: '', comuna: '', pedido_detallado: ''
    });
    const [mensaje, setMensaje] = useState('');
    const [loadingForm, setLoadingForm] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState('');

    useEffect(() => {
        if (!estatura) {
            console.log('No hay estatura definida, pero no redirigimos automáticamente');
        }
    }, [estatura]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setCargando(true);
                setError(null);

                const [productoData, categoriasData] = await Promise.all([
                    getProductoById(id),
                    getCategorias()
                ]);

                if (!productoData) {
                    setError('Producto no encontrado');
                    return;
                }

                setProducto(productoData);
                setCategorias(categoriasData);

                const relacionadosData = await getProductosRelacionados(id);
                setProductosRelacionados(relacionadosData); 

                if (estatura) {
                    const precioInfo = await getPrecioAjustado(id, estatura);
                    setPrecioCalculadoInfo(precioInfo);
                }
            } catch (error) {
                console.error('Error al cargar producto o relacionados:', error);
                setError('Error al cargar el producto o datos relacionados');
            } finally {
                setCargando(false);
            }
        };

        fetchData();
    }, [id, estatura]); 

    const construirUrlImagen = (imagenPath) => {
        if (!imagenPath) return 'https://via.placeholder.com/600x400?text=Imagen+No+Disponible';
        if (imagenPath.startsWith('http')) return imagenPath;
        return `http://127.0.0.1:8000${imagenPath}`;
    };

    const formatearPrecio = (precio) => new Intl.NumberFormat('es-ES', { 
        style: 'currency', 
        currency: 'CLP', 
        minimumFractionDigits: 0 
    }).format(precio);

    const getNombreCategoria = (categoriaId) => {
        const categoria = categorias.find(cat => String(cat.id) === String(categoriaId));
        return categoria ? categoria.categorias : 'Sin categoría';
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    const resetRecaptcha = () => {
        setRecaptchaToken('');
        if (recaptchaRef.current) { recaptchaRef.current.reset(); }
    };

    const cerrarModal = () => {
        setShowForm(false);
        resetRecaptcha();
    };
    

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingForm(true);
        setMensaje('');

        if (!recaptchaToken) {
            setMensaje('❌ Por favor, verifica que no eres un robot');
            setLoadingForm(false);
            return;
        }

        try {
            await axios.post('http://localhost:8000/api/solicitudes/', {
                producto: producto.id, 
                nombre_cliente: formData.nombre,
                email_cliente: formData.email,
                telefono: formData.telefono,
                detalles: formData.pedido_detallado || 'Sin detalles adicionales', 
                altura: estatura, 
                recaptcha_token: recaptchaToken, 
            });


            setFormData({ nombre: '', email: '', telefono: '', cantidad: 1, ciudad: '', comuna: '', pedido_detallado: '' });
            resetRecaptcha();
            setShowForm(false); 
            setShowSuccessModal(true); 

        } catch (error) {
            console.error(error.response?.data || error.message);
            setMensaje('❌ Error al enviar el pedido');
            resetRecaptcha();
        } finally {
            setLoadingForm(false);
        }
    };


    if (cargando) {
        return (
            <div className="cargando-container">
            <div className="cargando-spinner"></div>
            <p>Cargando producto...</p>
            </div>
        );
    }

    if (error || !producto) {
        return (
            <div className="error-container">
            <div className="error-message">
                <h2>Error</h2>
                <p>{error || 'Producto no encontrado'}</p>
                <Link to="/catalogo" className="btn-volver">Volver al catálogo</Link>
            </div>
            </div>
        );
    }

    const basePrice = producto.precio_base;
    const precioFinalDisplay = precioCalculadoInfo ? precioCalculadoInfo.precioFinal : basePrice;
    const precioAntesOferta = precioCalculadoInfo ? precioCalculadoInfo.precioAntesOferta : basePrice;

    const hayOfertaAplicada = precioCalculadoInfo && precioCalculadoInfo.descuentoAplicado !== null;
    const hayAjusteAlturaSinOferta = !hayOfertaAplicada && precioFinalDisplay !== basePrice;
    const showPrecioAntes = hayOfertaAplicada || hayAjusteAlturaSinOferta; 


    return (
        <div className="producto-detalle-container">
            <nav className="breadcrumb">
            <Link to="/">Inicio</Link>
            <span> / </span>
            <Link to="/catalogo">Catálogo</Link>
            <span> / </span>
            <span>{producto.nombre}</span>
            </nav>

            <div className="producto-detalle-content">
            <div className="producto-imagen-section">
                <div className="imagen-principal">
                <img 
                    src={construirUrlImagen(producto.imagen)} 
                    alt={producto.nombre}
                    onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x400?text=Imagen+No+Disponible';
                    }}
                />
                </div>
            </div>

            <div className="producto-info-section">
                <div className="producto-header">
                <span className="categoria-badge">
                    {getNombreCategoria(producto.categoria)}
                </span>
                <h1>{producto.nombre}</h1>
                <p className="descripcion-breve">{producto.descripcion_breve}</p>
                </div>

                <div className="precio-section">

                    <div className={`precio-actual ${hayOfertaAplicada ? 'precio-descuento-active' : ''}`}>
                    {formatearPrecio(precioFinalDisplay)}
                    </div>

                    {showPrecioAntes && (
                        <div className="precio-comparacion">
                            <span className="precio-antes-tached">
                                {hayOfertaAplicada ? 'Precio Antes:' : 'Precio Ajustado por Altura: '} 
                                {formatearPrecio(precioAntesOferta)}
                            </span>
                        </div>
                    )}
                    

                    <div className="precio-comparacion">
                        <span className="precio-base-referencia">
                            Precio Base: {formatearPrecio(basePrice)}
                        </span>
                    </div>

                </div>

                <div className="estatura-info">
                <p>
                    <strong>Precio ajustado para tu estatura:</strong> {estatura}m
                    {precioCalculadoInfo && hayOfertaAplicada && (
                        <span className="descuento-aplicado-badge"> 
                            (¡Oferta: {precioCalculadoInfo.descuentoAplicado}% aplicado!)
                        </span>
                    )}
                </p>
                </div>

                <div className="acciones-section">
                {producto.stock > 0 ? (
                    <div className="botones-accion">
                    <button className="btn-principal" onClick={() => setShowForm(true)}>
                        Lo Quiero
                    </button>
                    </div>
                ) : (
                    <div className="producto-agotado">
                    <p>Producto temporalmente agotado</p>
                    <button className="btn-contacto">
                        Notificarme cuando esté disponible
                    </button>
                    </div>
                )}
                </div>
            </div>
            </div>

            <div className="descripcion-detallada-section">
            <h3>Descripción Detallada</h3>
            <div className="descripcion-content">
                {producto.descripcion ? (
                <p>{producto.descripcion}</p>
                ) : (
                <p className="sin-descripcion">No hay descripción detallada disponible para este producto.</p>
                )}
            </div>
            </div>


            {productosRelacionados.length > 0 && (
                <div className="productos-relacionados-section">
                    <h2>Productos que te podrían interesar:</h2>
                    <div className="relacionados-grid">
                        {productosRelacionados.map(relacionado => (
                            <Link 
                                to={`/producto/${relacionado.id}`} 
                                key={relacionado.id} 
                                className="relacionado-card"

                                onClick={() => { 
                                    navigate(`/producto/${relacionado.id}`); 
                                    window.location.reload();
                                }} 
                            >
                                <img src={construirUrlImagen(relacionado.imagen)} alt={relacionado.nombre} />
                                <div className='part2'>
                                    <h4>{relacionado.nombre}</h4>
                                    
                                    <p>{formatearPrecio(relacionado.precio_base)}</p>
                                </div>
                                
                            </Link>
                        ))}
                    </div>
                </div>
            )}



            <div className="volver-section">
            <Link to="/catalogo" className="btn-volver-catalogo">
                ← Volver al catálogo
            </Link>
            </div>


            {showForm && (
            <div className="modal-overlay">
                <div className="modal-contenido">
                <button className="modal-cerrar" onClick={cerrarModal}>✕</button>
                <h3 className="modal-titulo">Completa tus datos</h3>

                <form onSubmit={handleSubmit} className="formulario">
                    <label>Nombre</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    
                    <label>Correo electrónico</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    
                    <label>Teléfono</label>
                    <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />
                    
                    <label>Cantidad</label>
                    <input type="number" name="cantidad" min="1" value={formData.cantidad} onChange={handleChange} required />
                    
                    <label>Ciudad</label>
                    <select name="ciudad" value={formData.ciudad} onChange={handleChange} required>
                    <option value="Concepción">Concepción</option>
                    </select>
                    
                    <label>Comuna</label>
                    <select name="comuna" value={formData.comuna} onChange={handleChange} required>
                    <option value="Concepción">Concepción</option>
                    <option value="Talcahuano">Talcahuano</option>
                    <option value="Chiguayante">Chiguayante</option>
                    <option value="San Pedro de la Paz">San Pedro de la Paz</option>
                    <option value="Hualpén">Hualpén</option>
                    </select>
                    
                    
                    <label>Indicaciones opcionales</label>
                    <textarea
                    name="pedido_detallado"
                    value={formData.pedido_detallado}
                    onChange={handleChange}
                    placeholder="Ej: Color preferido, detalles específicos, etc."
                    />

                    <div className="recaptcha-container">
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey="6LejYuUrAAAAAGH5AC6njVOlqHFDMxjlqfs_12Up" 
                        onChange={handleRecaptchaChange}
                    />
                    </div>

                    <p className="nota">💡 En caso de cambiar la estatura, el precio se recalculará.</p>

                    <button 
                    type="submit" 
                    className="btn-enviar" 
                    disabled={loadingForm || !recaptchaToken}
                    >
                    {loadingForm ? 'Enviando...' : 'Enviar pedido'}
                    </button>
                </form>
                </div>
            </div>
            )}
            

            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-contenido" style={{ maxWidth: '400px' }}>
                        <h3 className="modal-titulo" style={{ color: '#34b1b1', marginBottom: '15px' }}>
                            🎉 Pedido Enviado con Éxito
                        </h3>
                        <p style={{ textAlign: 'center', marginBottom: '30px', fontSize: '1.1rem' }}>
                            Tu solicitud ha sido recibida. Te contactaremos pronto para confirmar los detalles.
                        </p>
                        <button className="btn-enviar" onClick={closeSuccessModal} style={{ width: '100%' }}>
                            Entendido
                        </button>
                    </div>
                </div>
            )}
            
            {mensaje && <p className="mensaje">{mensaje}</p>}
        </div>
    );
};

export default ProductoDetalle;