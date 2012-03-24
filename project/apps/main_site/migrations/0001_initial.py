# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'Existence'
        db.create_table('main_site_existence', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('when', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('where', self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True)),
            ('lat', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('lon', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('lookup_attempted', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal('main_site', ['Existence'])


    def backwards(self, orm):
        
        # Deleting model 'Existence'
        db.delete_table('main_site_existence')


    models = {
        'main_site.existence': {
            'Meta': {'object_name': 'Existence'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lat': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'lon': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'lookup_attempted': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'when': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'where': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['main_site']
