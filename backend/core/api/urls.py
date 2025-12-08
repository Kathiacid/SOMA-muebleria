from rest_framework.routers import DefaultRouter
from core.api.views import CategoriaViewSet, ProductoViewSet, SolicitudViewSet,ProductoDestacadoViewSet

router = DefaultRouter()
router.register('categorias', CategoriaViewSet, basename='categoria')
router.register('productos', ProductoViewSet, basename='producto')
router.register('solicitudes', SolicitudViewSet, basename='solicitud')
router.register('productos-destacados',ProductoDestacadoViewSet,basename='productos-destacados')
urlpatterns = router.urls