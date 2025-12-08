# views.py
from decimal import Decimal, InvalidOperation
from django.utils import timezone # Importación necesaria para el filtro de ofertas
import traceback
import requests

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from django.core.mail import send_mail
from django.conf import settings

from core.models import Categoria, Producto, Solicitud,ProductoDestacado
from .serializers import CategoriaSerializer, ProductoSerializer, SolicitudSerializer,ProductoDestacadoSerializer


class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class ProductoViewSet(viewsets.ReadOnlyModelViewSet):
    # 👇 Filtra solo productos con stock=True
    queryset = Producto.objects.filter(stock=True)
    serializer_class = ProductoSerializer

    def get_serializer_context(self):
        """
        Enriquece el contexto del serializer con el parámetro 'altura' de la URL.
        """
        context = super().get_serializer_context()
        altura = self.request.query_params.get('altura', None)
        context['altura'] = altura
        return context

    # 🚨 MÉTODO 1: Endpoint para calcular precio
    @action(detail=True, methods=['get'])
    def calcular_precio(self, request, pk=None):
        producto = self.get_object()
        altura = request.query_params.get('altura')

        if not altura:
            return Response(
                {'error': 'Debes enviar la altura en el parámetro ?altura=valor'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Llama a la función del modelo que devuelve el diccionario de triple precio
            precios = producto.obtener_precio_final(altura)
            
            # Devuelve el diccionario completo
            return Response(precios) 
            
        except Exception as e:
            # Registramos el error y devolvemos un mensaje genérico
            print(f"Error en calcular_precio para producto {pk} con altura {altura}: {e}")
            return Response(
                {'error': 'Error interno al calcular el precio.'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    # 🚨 MÉTODO 2: ENDPOINT PARA PRODUCTOS EN OFERTA
    @action(detail=False, methods=['get'])
    def productos_en_oferta(self, request):
        now = timezone.now()
        
        # Filtramos productos que tienen una oferta activa y están en stock
        productos_ofertados = self.get_queryset().filter(
            ofertas__activa=True,
            ofertas__fecha_inicio__lte=now,
            ofertas__fecha_fin__gte=now
        ).distinct() # Usamos .distinct() para evitar duplicados si un producto tiene varias ofertas

        # Serializamos los productos encontrados
        serializer = self.get_serializer(productos_ofertados, many=True)
        return Response(serializer.data)
        
    # ⭐️ MÉTODO 3: NUEVO ENDPOINT PARA PRODUCTOS RELACIONADOS POR CATEGORÍA
    @action(detail=True, methods=['get'])
    def productos_relacionados(self, request, pk=None):
        """
        Obtiene productos de la misma categoría del producto actual, 
        excluyendo el producto actual y devolviendo hasta 4 productos aleatorios.
        Endpoint: /api/productos/{id}/productos_relacionados/
        """
        try:
            # 1. Obtener el producto actual y su categoría
            producto_actual = self.get_object()
            categoria_id = producto_actual.categoria_id
            
            # 2. Realizar el QuerySet eficiente:
            # Filtra por la misma categoría, que tengan stock, excluye el producto actual (pk) 
            # y los limita a 4 elegidos al azar (order_by('?')).
            productos_relacionados = Producto.objects.filter(
                categoria_id=categoria_id,
                stock=True
            ).exclude(pk=pk).order_by('?')[:4]

            # 3. Serializar y devolver (usando el serializer base)
            serializer = self.get_serializer(productos_relacionados, many=True)
            return Response(serializer.data)

        except Exception as e:
            print(f"Error al buscar productos relacionados para ID {pk}: {e}")
            return Response({'error': 'Error al buscar productos relacionados.'}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SolicitudViewSet(viewsets.ModelViewSet):
    queryset = Solicitud.objects.all()
    serializer_class = SolicitudSerializer
    http_method_names = ['post']
    
    def create(self, request, *args, **kwargs):
        print("=" * 50)
        print("🟢 DEBUG INICIADO")
        print("🟢 Datos recibidos en solicitud:", request.data)
        print("🟢 Content-Type:", request.content_type)
        print("🟢 Método:", request.method)
        
        # ✅ Primero validar reCAPTCHA
        recaptcha_token = request.data.get('recaptcha_token')
        print("🟢 reCAPTCHA token recibido:", recaptcha_token)
        
        if not recaptcha_token:
            print(" DEBUG: Falta recaptcha_token")
            return Response(
                {'error': 'Token reCAPTCHA faltante'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar reCAPTCHA con Google
        try:
            recaptcha_data = {
                'secret': settings.RECAPTCHA_SECRET_KEY,
                'response': recaptcha_token
            }
            
            print("🟢 Enviando reCAPTCHA a Google...")
            recaptcha_response = requests.post(
                'https://www.google.com/recaptcha/api/siteverify',
                data=recaptcha_data
            )
            
            result = recaptcha_response.json()
            print("🟢 Resultado reCAPTCHA:", result)
            
            if not result.get('success'):
                print(" DEBUG: reCAPTCHA falló")
                return Response(
                    {'error': 'Verificación reCAPTCHA fallida'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                print("✅ DEBUG: reCAPTCHA válido")
                
        except Exception as e:
            print(" DEBUG: Error en reCAPTCHA:", str(e))
            return Response(
                {'error': f'Error validando reCAPTCHA: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Validar serializer y mostrar errores DETALLADOS
        print("🟢 Validando serializer...")
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            print(" DEBUG: Errores de validación del serializer:")
            print("", serializer.errors)
            return Response(
                {
                    'error': 'Datos inválidos', 
                    'detalles': serializer.errors,
                    'datos_recibidos': request.data
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        print("✅ DEBUG: Serializer válido, continuando...")

        # ✅ Si reCAPTCHA es válido, continuar con el proceso normal
        self.perform_create(serializer)

        solicitud = serializer.instance
        producto = solicitud.producto

        print(f" DEBUG: Solicitud creada - ID: {solicitud.id}")

        # 🔸 Calcular precio según altura (Usando la función que solo calcula el aumento)
        altura = request.data.get('altura')
        print(f" Altura recibida: {altura}")
        if altura:
            try:
                altura_decimal = Decimal(altura)
                solicitud.altura_usuario = altura_decimal

                # Calcular precio ajustado (solo ajuste de altura, sin oferta)
                precio_calculado = producto.calcular_precio_altura(altura_decimal)
                solicitud.precio_calculado = precio_calculado
                solicitud.save()
                print(f" Precio calculado: {precio_calculado}")

            except (InvalidOperation, ValueError) as e:
                print(f" Altura inválida: {altura}. Error: {e}")
                traceback.print_exc()

        # 🔸 Enviar correo al admin
        try:
            asunto_admin = f"🚨 NUEVA SOLICITUD: {solicitud.producto.nombre}"
            mensaje_admin = f"""
Tienes una nueva solicitud de cotización:

📦 Producto: {solicitud.producto.nombre}
👤 Cliente: {solicitud.nombre_cliente}
📧 Email: {solicitud.email_cliente}
📞 Teléfono: {solicitud.telefono or 'No proporcionado'}

📏 Altura: {solicitud.altura_usuario or 'No proporcionada'}
💰 Precio ajustado: ${solicitud.precio_calculado or producto.precio_base}

📝 Detalles de personalización:
{solicitud.detalles}

⏰ Fecha: {solicitud.fecha}
"""
            send_mail(
                asunto_admin,
                mensaje_admin,
                settings.DEFAULT_FROM_EMAIL,
                [settings.EMAIL_HOST_USER],
                fail_silently=False,
            )
            print("📨 Correo enviado al admin")
        except Exception as e:
            print("❌ Error al enviar correo al admin:", e)
            traceback.print_exc()

        # 🔸 Enviar correo al cliente
        try:
            asunto_cliente = "✅ Confirmación de solicitud - Mi Mueblería"
            mensaje_cliente = f"""
Hola {solicitud.nombre_cliente},

¡Gracias por tu interés en nuestros productos!

Hemos recibido tu solicitud de cotización para:
🛋️ Producto: {solicitud.producto.nombre}

📏 Altura ingresada: {solicitud.altura_usuario or 'No especificada'}
💰 Precio estimado: ${solicitud.precio_calculado or 'Por calcular'}

📋 Tus detalles de personalización:
{solicitud.detalles}

Nuestro equipo se pondrá en contacto contigo en las próximas 24 horas 
para discutir los detalles y proporcionarte un precio exacto.

¡Gracias por confiar en nosotros!

Atentamente,
El equipo de SOMA Mueblería
"""
            send_mail(
                asunto_cliente,
                mensaje_cliente,
                settings.DEFAULT_FROM_EMAIL,
                [solicitud.email_cliente],
                fail_silently=False,
            )
            print("📨 Correo enviado al cliente")
        except Exception as e:
            print("❌ Error al enviar correo al cliente:", e)
            traceback.print_exc()

        print("✅ Fin del proceso de envío")
        print("=" * 50)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        return Response(
            {"detail": "Método no permitido."}, 
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
    
    def retrieve(self, request, *args, **kwargs):
        return Response(
            {"detail": "Método no permitido."}, 
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def update(self, request, *args, **kwargs):
        return Response(
            {"detail": "Método no permitido."}, 
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def partial_update(self, request, *args, **kwargs):
        return Response(
            {"detail": "Método no permitido."}, 
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def destroy(self, request, *args, **kwargs):
        return Response(
            {"detail": "Método no permitido."}, 
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
    
class ProductoDestacadoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductoDestacadoSerializer
    
    def get_queryset(self):
        # Optimizado: un solo query con select_related
        return ProductoDestacado.objects.filter(
            activo=True
        ).select_related('producto').order_by('-orden', '-fecha_creacion')