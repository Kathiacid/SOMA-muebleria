import axios from "axios";

function capitalizarPrimeraLetra(texto) {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}
const BASE_URL = "http://127.0.0.1:8000/api/";

export const getCategorias = async () => {
    try {
        const response = await axios.get(`${BASE_URL}categorias/`);
        return response.data.map(cat => ({
            id: cat.id,
            categorias: cat.categorias_display, 
            descripcion: cat.descripcion
        }));
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        return [];
    }
};

export const getProductos = async () => {
    try {
        const response = await axios.get(`${BASE_URL}productos/`);
        return response.data.map(prod => ({
            id: prod.id,
            imagen: prod.imagen,
            imagenes_secundarias: prod.imagenes_secundarias || [], 
            nombre: prod.nombre,
            categoria: prod.categoria,
            stock: prod.stock,
            precio_base: prod.precio_base,
            descripcion: prod.descripcion,
            tipo_mueble: prod.tipo_mueble,
            altura: prod.altura,
            fecha_creacion: prod.fecha_creacion,
            estado_oferta: prod.estado_oferta,
        }));
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return [];
    }
};

export const getProductosEnOferta = async () => {
    try {
        const response = await axios.get(`${BASE_URL}productos/productos_en_oferta/`);
        return response.data.map(prod => ({
            id: prod.id,
            imagen: prod.imagen,
            // 🚨 AGREGADO
            imagenes_secundarias: prod.imagenes_secundarias || [],
            nombre: prod.nombre,
            categoria: prod.categoria,
            stock: prod.stock,
            precio_base: prod.precio_base,
            descripcion: prod.descripcion,
            tipo_mueble: prod.tipo_mueble,
            altura: prod.altura,
            fecha_creacion: prod.fecha_creacion,
        }));
    } catch (error) {
        console.error("Error al obtener productos en oferta:", error);
        return [];
    }
};

export const getProductoById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}productos/${id}/`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener producto:", error);
        return null;
    }
};

export const enviarSolicitud = async (solicitudData) => {
    try {
        const response = await axios.post(`${BASE_URL}solicitudes/`, solicitudData);
        return response.data;
    } catch (error) {
        console.error("Error al enviar solicitud:", error);
        throw error;
    }
};

export const getPrecioAjustado = async (productoId, altura) => {
    try {
        const response = await axios.get(
            `${BASE_URL}productos/${productoId}/calcular_precio/`,
            { params: { altura } }
        );
        return {
            precioFinal: response.data.precio_final,
            precioBase: response.data.precio_base,
            precioAntesOferta: response.data.precio_antes_oferta, 
            descuentoAplicado: response.data.descuento_aplicado, 
        };
        
    } catch (error) {
        console.error(`Error al calcular precio para producto ${productoId}:`, error);
        return null; 
    }
};

export const getProductosDestacados = async () => {
    try {
        const response = await axios.get(`${BASE_URL}productos-destacados/`);
        return response.data.map(item => ({
            id: item.id,
            producto: item.producto,
            producto_nombre: item.producto_nombre,
            producto_descripcion: item.producto_descripcion,
            producto_precio: item.producto_precio,
            producto_imagen: item.producto_imagen,
            producto_imagenes_secundarias: item.producto_imagenes_secundarias || [],
            producto_tipo_mueble_display: item.producto_tipo_mueble_display,
        }));
    } catch (error) {
        console.error("Error al obtener productos destacados:", error);
        return [];
    }
};

export const getProductosRelacionados = async (productoId) => {
    try {
        const response = await axios.get(`${BASE_URL}productos/${productoId}/productos_relacionados/`);
        
        return response.data.map(prod => ({
            id: prod.id,
            imagen: prod.imagen,
            imagenes_secundarias: prod.imagenes_secundarias || [],
            nombre: prod.nombre,
            precio_base: prod.precio_base, 
        }));
    } catch (error) {
        console.error(`Error al obtener productos relacionados para ID ${productoId}:`, error);
        return [];
    }
};