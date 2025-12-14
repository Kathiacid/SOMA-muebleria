from django.contrib import admin
from core.models import Categoria, Producto, Solicitud,ProductoDestacado,Oferta
admin.site.register(Categoria)
admin.site.register(Producto)
admin.site.register(Solicitud)


@admin.register(ProductoDestacado)
class ProductoDestacadoAdmin(admin.ModelAdmin):
    list_display = ['producto', 'orden', 'activo', 'fecha_creacion']
    list_editable = ['orden', 'activo']
    list_filter = ['activo', 'fecha_creacion']
    search_fields = ['producto__nombre']
    ordering = ['-orden', '-fecha_creacion']

@admin.register(Oferta)
class OfertaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'porcentaje_descuento', 'fecha_inicio', 'fecha_fin', 'activa')
    list_filter = ('activa', 'fecha_fin')
    filter_horizontal = ('productos',)