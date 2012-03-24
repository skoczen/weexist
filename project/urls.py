from django.conf.urls.defaults import patterns, include, url
from django.conf import settings

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^', include('main_site.urls', app_name="main_site", namespace="main_site")),    

    url(r'^fonts/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': "%s/main_site/fonts" % settings.STATIC_ROOT,
    }),
)
