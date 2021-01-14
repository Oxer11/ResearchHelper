from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('import_paper/', views.import_paper, name='import_paper'),
    path('get_paper/', views.get_paper, name='get_paper'),
    path('add_paper/', views.add_paper, name='add_paper'),
    path('delete_paper/', views.delete_paper, name='delete_paper'),
    path('edit_paper/', views.edit_paper, name='edit_paper'),
    path('add_event/', views.add_event, name='add_event'),
    path('get_event/', views.get_event, name='get_event'),
    path('edit_event/', views.edit_event, name='edit_event'),
    path('delete_event/', views.delete_event, name='delete_event'),
]