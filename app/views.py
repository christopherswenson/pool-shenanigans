from django.http import HttpResponse, JsonResponse
from django.http import Http404
from django.template import loader
from django.conf import settings

import os

def all_static_files():
    filemap = {'css': [], 'js': [], 'html': []}
    static_root = os.path.join(settings.BASE_DIR, "app", settings.STATIC_URL[1:])
    app_root = os.path.join(static_root, "app")
    for root, dirs, files in os.walk(app_root):
        for filename in files:
            extension = os.path.splitext(filename)[1][1:]
            if filemap.get(extension) is not None:
                fileobj = {
                    'path': os.path.join(root, filename)[len(static_root):],
                    'name': filename
                }
                filemap[extension].append(fileobj)
    return filemap

def app(request):
    if request.method != 'GET':
        raise Http404
    template = loader.get_template('app.html')
    required_files = all_static_files()
    return HttpResponse(template.render(required_files, request))
