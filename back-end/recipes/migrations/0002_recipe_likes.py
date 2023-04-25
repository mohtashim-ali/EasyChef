# Generated by Django 4.1.6 on 2023-03-24 21:05

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('recipes', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='likes',
            field=models.ManyToManyField(blank=True, related_name='recipe_likes', to=settings.AUTH_USER_MODEL),
        ),
    ]
