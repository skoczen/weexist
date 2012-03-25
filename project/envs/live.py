from envs.common import *

DEBUG = False
TEMPLATE_DEBUG = DEBUG

# EMAIL_BACKEND = 'django_ses.SESBackend'

STATIC_URL = 'http://%s.s3.amazonaws.com/' % AWS_STORAGE_BUCKET_NAME
COMPRESS_URL = STATIC_URL
FAVICON_URL = "%sfavicon.ico" % STATIC_URL

DEFAULT_FILE_STORAGE = 'storages.backends.s3boto.S3BotoStorage'
STATICFILES_STORAGE = "backends.CachedS3BotoStorage"
COMPRESS_STORAGE = STATICFILES_STORAGE

COMPRESS_ENABLED = True
COMPRESS_OFFLINE = True