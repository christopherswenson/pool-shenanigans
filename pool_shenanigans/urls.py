from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings
import re

apppatterns = [
    url(r'^api/', include('api.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^', include('app.urls')),
]

prefix = "^" + settings.URL_PREFIX #re.compile()

urlpatterns = [
    url(prefix, include(apppatterns))
]
