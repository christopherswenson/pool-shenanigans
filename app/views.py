from django.http import HttpResponse, JsonResponse
from django.http import Http404
from django.template import loader
from django.conf import settings

import os

def all_static_files():
    filemap = {'css': [], 'js': [], 'html': []}
    app_static_root = os.path.join(settings.BASE_DIR, settings.APP_STATIC_PATH[1:])
    for root, dirs, files in os.walk(app_static_root):
        for filename in files:
            extension = os.path.splitext(filename)[1][1:]
            if filemap.get(extension) is not None:
                fileobj = {
                    'path': os.path.join(root, filename)[len(app_static_root) - len("/app"):],
                    'name': filename
                }
                filemap[extension].append(fileobj)
    return filemap

def app(request):
    if request.method != 'GET':
        raise Http404
    template = loader.get_template('app.html')
    required_files = all_static_files()
    return HttpResponse(template.render({
        'css': required_files['css'],
        'js': required_files['js'],
        'html': required_files['html'],
        'url_prefix': settings.URL_PREFIX,
        'db_name': settings.DB_NAME,
    }, request))
