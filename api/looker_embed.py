import urllib
import base64
import json
import time
import binascii
import os
from hashlib import sha1
import hmac
from django.conf import settings

class Looker:
  def __init__(self, host, secret):
    self.secret = secret
    self.host = host


class EmbedUser:
  def __init__(self, id=id, first_name=None, last_name=None,
               permissions=[], models=[], group_ids=[], external_group_id=None,
               user_attributes={}, access_filters={}):
    self.external_user_id = json.dumps(id)
    self.first_name = json.dumps(first_name)
    self.last_name = json.dumps(last_name)
    self.permissions = json.dumps(permissions)
    self.models = json.dumps(models)
    self.access_filters = json.dumps(access_filters)
    self.user_attributes = json.dumps(user_attributes)
    self.group_ids = json.dumps(group_ids)
    self.external_group_id = json.dumps(external_group_id)


class EmbedUrl:
  def __init__(self, looker, user, session_length, embed_url, force_logout_login=False):
    self.looker = looker
    self.user = user
    self.path = '/login/embed/' + urllib.quote_plus(embed_url)
    self.session_length = json.dumps(session_length)
    self.force_logout_login = json.dumps(force_logout_login)

  def set_time(self):
    self.time = json.dumps(int(time.time()))

  def set_nonce(self):
    self.nonce = json.dumps(binascii.hexlify(os.urandom(16)))

  def sign(self):
    #  Do not change the order of these
    string_to_sign = ""
    string_to_sign = string_to_sign + self.looker.host           + "\n"
    string_to_sign = string_to_sign + self.path                  + "\n"
    string_to_sign = string_to_sign + self.nonce                 + "\n"
    string_to_sign = string_to_sign + self.time                  + "\n"
    string_to_sign = string_to_sign + self.session_length        + "\n"
    string_to_sign = string_to_sign + self.user.external_user_id + "\n"
    string_to_sign = string_to_sign + self.user.permissions      + "\n"
    string_to_sign = string_to_sign + self.user.models           + "\n"
    string_to_sign = string_to_sign + self.user.group_ids        + "\n"
    string_to_sign = string_to_sign + self.user.external_group_id + "\n"
    string_to_sign = string_to_sign + self.user.user_attributes  + "\n"
    string_to_sign = string_to_sign + self.user.access_filters

    signer = hmac.new(self.looker.secret, string_to_sign.encode('utf8'), sha1)
    self.signature = base64.b64encode(signer.digest())

  def to_string(self):
    self.set_time()
    self.set_nonce()
    self.sign()

    params = {'nonce':               self.nonce,
              'time':                self.time,
              'session_length':      self.session_length,
              'external_user_id':    self.user.external_user_id,
              'permissions':         self.user.permissions,
              'models':              self.user.models,
              'group_ids':           self.user.group_ids,
              'external_group_id':   self.user.external_group_id,
              'user_attributes':     self.user.user_attributes,
              'access_filters':      self.user.access_filters,
              'signature':           self.signature,
              'first_name':          self.user.first_name,
              'last_name':           self.user.last_name,
              'force_logout_login':  self.force_logout_login}

    query_string = '&'.join(["%s=%s" % (key, urllib.quote_plus(val)) for key, val in params.iteritems()])

    return "%s%s?%s" % (self.looker.host, self.path, query_string)

def embed_url_for_user(app_user, link):
    looker = Looker(settings.EMBED_HOST, settings.EMBED_SECRET)

    user = EmbedUser(
        app_user.id,
        first_name=app_user.first_name,
        last_name=app_user.last_name,
        permissions=[
            'access_data',
            'create_table_calculations',
            'download_without_limit',
            'explore',
            'manage_spaces',
            'save_content',
            'schedule_look_emails',
            'see_lookml',
            'see_lookml_dashboards',
            'see_looks',
            'see_sql',
            'see_user_dashboards',
            'embed_browse_spaces',
        ],
        models=['pool_shenanigans'],
        group_ids=[28],
        external_group_id='pool_player',
        user_attributes={'db_database': settings.DB_NAME},
        access_filters={}
    )

    one_day = 24 * 60 * 60

    url = EmbedUrl(looker, user, one_day, link, force_logout_login=True)

    return "https://" + url.to_string()
