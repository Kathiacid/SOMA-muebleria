from rest_framework import serializers
from core.models import Categoria, Producto, Solicitud, ProductoDestacado
from decimal import Decimal

class CategoriaSerializer(serializers.ModelSerializer):
    categorias_display = serializers.CharField(source='get_categorias_display', read_only=True)
    
    class Meta:
        model = Categoria
        fields = ['id', 'categorias', 'categorias_display', 'descripcion']


class ProductoSerializer(serializers.ModelSerializer):
    estado_oferta = serializers.SerializerMethodField()
    imagenes_secundarias = serializers.SerializerMethodField()
    
    class Meta:
        model = Producto
        fields = '__all__'
        
    def get_imagenes_secundarias(self, obj):
        imagenes = []
        request = self.context.get('request')
        if obj.imagen_secundaria_1:
            url = obj.imagen_secundaria_1.url
            if request:
                url = request.build_absolute_uri(url)
            imagenes.append(url)

        if obj.imagen_secundaria_2:
            url = obj.imagen_secundaria_2.url
            if request:
                url = request.build_absolute_uri(url)
            imagenes.append(url)

        return imagenes

    def get_estado_oferta(self, obj):
        altura = self.context.get('altura', None)
        precios = obj.obtener_precio_final(altura)
        
        precio_antes_oferta = Decimal(str(precios.get('precio_antes_oferta'))) 
        precio_final = Decimal(str(precios.get('precio_final')))
        precio_base = obj.precio_base
        
        if precio_final < precio_antes_oferta:
            return "EN OFERTA"
        
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
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    producto_descripcion = serializers.CharField(source='producto.descripcion', read_only=True)
    producto_precio = serializers.DecimalField(source='producto.precio_base', max_digits=10, decimal_places=2, read_only=True)
    producto_imagen = serializers.ImageField(source='producto.imagen', read_only=True)
    producto_tipo_mueble_display = serializers.CharField(source='producto.get_tipo_mueble_display', read_only=True)
    producto_imagenes_secundarias = serializers.SerializerMethodField()

    class Meta:
        model = ProductoDestacado
        fields = [
            'id', 
            'producto', 
            'producto_nombre', 
            'producto_descripcion',
            'producto_precio', 
            'producto_imagen', 
            'producto_imagenes_secundarias',
            'producto_tipo_mueble_display', 
            'fecha_creacion', 
            'activo', 
            'orden'
        ]

    def get_producto_imagenes_secundarias(self, obj):
        imagenes = []
        request = self.context.get('request')
        product = obj.producto 

        if product.imagen_secundaria_1:
            url = product.imagen_secundaria_1.url
            if request: url = request.build_absolute_uri(url)
            imagenes.append(url)

        if product.imagen_secundaria_2:
            url = product.imagen_secundaria_2.url
            if request: url = request.build_absolute_uri(url)
            imagenes.append(url)
            
        return imagenes