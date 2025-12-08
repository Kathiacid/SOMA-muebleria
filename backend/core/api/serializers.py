from rest_framework import serializers
from core.models import Categoria, Producto, Solicitud, ProductoDestacado
from decimal import Decimal

class CategoriaSerializer(serializers.ModelSerializer):
    # Agregar campo para el display name
    categorias_display = serializers.CharField(source='get_categorias_display', read_only=True)
    
    class Meta:
        model = Categoria
        fields = ['id', 'categorias', 'categorias_display', 'descripcion']


class ProductoSerializer(serializers.ModelSerializer):
    # 🚨 Eliminamos get_precio_calculado y get_precio_final_con_oferta.
    # El frontend usa el endpoint dedicado calcular_precio/ para esos valores.
    estado_oferta = serializers.SerializerMethodField()
    
    class Meta:
        model = Producto
        fields = '__all__'
        
    # 🚨 FUNCIÓN CORREGIDA PARA MANEJAR EL DICCIONARIO DE PRECIOS
    def get_estado_oferta(self, obj):
        # 1. Obtenemos la altura del contexto (si estamos en /productos/?altura=X)
        altura = self.context.get('altura', None)
        
        # 2. Llamamos al método que devuelve el diccionario de triple precio
        # Este método obtiene el precio final con ofertas (si existen)
        precios = obj.obtener_precio_final(altura)
        
        # 3. Extraemos los precios del diccionario
        # precio_antes_oferta es el precio ajustado por altura (el "precio_calc" anterior)
        precio_antes_oferta = Decimal(str(precios.get('precio_antes_oferta'))) 
        precio_final = Decimal(str(precios.get('precio_final')))
        precio_base = obj.precio_base
        
        # 4. Lógica de comparación de estado
        
        # A) Hay oferta si el precio final es menor al precio ajustado por altura
        if precio_final < precio_antes_oferta:
            return "EN OFERTA"
        
        # B) Hay ajuste al alza si el precio ajustado por altura es mayor al precio base
        if precio_antes_oferta > precio_base:
            return "AJUSTADO AL ALZA"

        return "NORMAL"


class SolicitudSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solicitud
        fields = '__all__'
        extra_kwargs = {
            'telefono': {'required': False, 'allow_blank': True},
            'altura_usuario': {'required': False},
            'precio_calculado': {'required': False},
        }


class ProductoDestacadoSerializer(serializers.ModelSerializer):
    # Incluir datos del producto relacionado
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    producto_descripcion = serializers.CharField(source='producto.descripcion', read_only=True)  # ← AGREGADO
    producto_precio = serializers.DecimalField(source='producto.precio_base', max_digits=10, decimal_places=2, read_only=True)
    producto_imagen = serializers.ImageField(source='producto.imagen', read_only=True)
    producto_tipo_mueble_display = serializers.CharField(source='producto.get_tipo_mueble_display', read_only=True)
    
    class Meta:
        model = ProductoDestacado
        fields = [
            'id', 
            'producto', 
            'producto_nombre', 
            'producto_descripcion',  # ← AGREGADO
            'producto_precio', 
            'producto_imagen', 
            'producto_tipo_mueble_display', 
            'fecha_creacion', 
            'activo', 
            'orden'
        ]