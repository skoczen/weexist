import urllib2
from urllib import quote_plus
from django.db import models

class Existence(models.Model):
    when = models.DateTimeField(auto_now_add=True)
    where = models.CharField(max_length=255,blank=True, null=True)
    lat = models.FloatField(blank=True, null=True)
    lon = models.FloatField(blank=True, null=True)
    lookup_attempted = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.lookup_attempted:
            response = urllib2.urlopen(
                "http://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=1&q=%s" % 
                (quote_plus(self.where),)
                )
            address = eval(response.read())[0]
            self.lat = address["lat"]
            self.lon = address["lon"]
            self.lookup_attempted = True

        super(Existence, self).save(*args, **kwargs)