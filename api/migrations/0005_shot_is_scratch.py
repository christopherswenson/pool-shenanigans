# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-08-24 21:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_shot_combo_count'),
    ]

    operations = [
        migrations.AddField(
            model_name='shot',
            name='is_scratch',
            field=models.BooleanField(default=False),
        ),
    ]
