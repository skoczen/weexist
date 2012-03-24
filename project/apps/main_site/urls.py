from django.conf.urls.defaults import *

from main_site import views

urlpatterns = patterns('',
    url(r'^$', views.home, name='home'),
    url(r'^i-exist$', views.i_exist, name='i_exist'),
)
