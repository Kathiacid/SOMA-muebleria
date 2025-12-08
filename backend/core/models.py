from django.db import models
from decimal import Decimal
from django.utils import timezone
# Create your models here.


class Categoria(models.Model):
    TIPOS_CATEGORIA = [
        ('sin categoria', 'SinCategoria'),
        ('cocina', 'Cocina'),
        ('bano', 'Baño'),
        ('exterior', 'Exterior'),
        ('living comedor', 'Living & Comedor'),
        ('taller', 'Taller'),
        ('habitacion', 'Habitación'),
        # 🚨 Nuevo valor para la categoría "Ofertas"
        ('ofertas', 'Ofertas'), 
    ]
    categorias = models.CharField(max_length=30, choices=TIPOS_CATEGORIA,default='sin categoria')
    descripcion = models.TextField()

    def __str__(self):
        return self.get_categorias_display() 


class Producto(models.Model):

    TIPOS_MUEBLE = [
        ('standard', 'Standard'),
        ('mesa taller', 'Mesa de Taller'),
        ('escritorio', 'Escritorio'),
        ('lavamanos', 'Lavamanos'),
        ('lavaplatos', 'Lavaplatos'),
        ('librero', 'Librero'),
    ]

    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='Producto')
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    precio_base = models.DecimalField(max_digits=10, decimal_places=2)
    imagen = models.ImageField(upload_to='producto/')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    tipo_mueble = models.CharField(max_length=20, 
                                choices=TIPOS_MUEBLE, 
                                default='standard')
    altura = models.DecimalField(max_digits=5,
                                    decimal_places=2,
                                    default=0.000,
                                    help_text="Altura del muebre en metros(sin ajustar)")
    stock = models.BooleanField(default=True)  
    def __str__(self):
        return self.nombre
    
    #funcion de calculo de precio

    def calcular_precio_altura(self,altura_usuario):
        try:
            altura = Decimal(altura_usuario)
        except (TypeError, ValueError):
            return self.precio_base
        
        if self.tipo_mueble == 'standard':
            return self.precio_base
        
        # reglas de aumento de precio segun tipo_mueble
        if Decimal('1.00') <= altura <= Decimal('1.50'):
            aumento = Decimal('1.00')   # sin aumento
        elif Decimal('1.51') <= altura <= Decimal('1.75'):
            aumento = Decimal('1.15')   # +15%
        elif altura >= Decimal('1.76'):
            aumento = Decimal('1.25')   # +25%
        else:
            aumento = Decimal('1.00')   # valor por defecto

        return self.precio_base * aumento 
    
    # 🚨 FUNCIÓN MODIFICADA PARA TRIPLE PRECIO
    def obtener_precio_final(self, altura_usuario=None):

        # 1. PRECIO AJUSTADO POR ALTURA (Precio "Antes" o de Referencia para Ofertas)
        precio_calculado_altura = self.calcular_precio_altura(altura_usuario)
        
        # 2. Inicializar valores
        precio_final = round(precio_calculado_altura, 2)
        descuento_aplicado = None
        
        # 3. BUSCAR OFERTA ACTIVA
        ofertas_activas = self.ofertas.filter(
            activa = True,
            fecha_inicio__lte=timezone.now(),
            fecha_fin__gte=timezone.now()
        )
        
        if ofertas_activas:
            mejor_oferta = ofertas_activas.order_by('-porcentaje_descuento').first()
            
            porcentaje = mejor_oferta.porcentaje_descuento / Decimal(100)
            descuento = precio_calculado_altura * porcentaje
            precio_con_descuento = precio_calculado_altura - descuento
            
            precio_final = round(precio_con_descuento, 2)
            descuento_aplicado = mejor_oferta.porcentaje_descuento
        
        # 🚨 RETORNA EL OBJETO COMPLETO DE PRECIOS
        return {
            'precio_base': float(round(self.precio_base, 2)), # Precio de la BD
            'precio_antes_oferta': float(round(precio_calculado_altura, 2)), # Precio ajustado por altura
            'precio_final': float(precio_final), # Precio final con la mejor oferta
            'descuento_aplicado': float(descuento_aplicado) if descuento_aplicado else None,
        }


    
class Oferta(models.Model):
    nombre = models.CharField(max_length=100,help_text="Ej:'Oferta de Invierno', 'Liquidación Final' ")
    productos = models.ManyToManyField('Producto',related_name='ofertas',blank=True)
    porcentaje_descuento = models.DecimalField(max_digits=5,decimal_places=2,help_text="Porcentaje de descuentos(ej: 15 para un 15%)")
    fecha_inicio = models.DateTimeField()
    fecha_fin= models.DateTimeField()
    activa = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.nombre} ({self.porcentaje_descuento}%)"



class Solicitud(models.Model):

    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    nombre_cliente = models.CharField(max_length=200)
    email_cliente = models.EmailField()
    telefono = models.CharField(max_length=20, blank=True, null=True)
    detalles = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)
    altura_usuario = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    precio_calculado = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f'Solicitud de {self.nombre_cliente} - {self.email_cliente}'
    

class ProductoDestacado(models.Model):
    producto = models.ForeignKey(
        Producto, 
        on_delete=models.CASCADE,
        related_name='destacados',
        verbose_name='Producto destacado'
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True, verbose_name='¿Activo?')
    orden = models.PositiveIntegerField(
        default=0,
        help_text='Orden de aparición (mayor número = más prioritario)'
    )
    
    class Meta:
        verbose_name = 'Producto destacado'
        verbose_name_plural = 'Productos destacados'
        ordering = ['-orden', '-fecha_creacion']
    
    def __str__(self):
        return f"Destacado: {self.producto.nombre}"
    
