# Generated by Django 4.1.6 on 2023-04-20 05:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0005_alter_recipephoto_image_alter_recipevideo_video_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='cooking_time',
            field=models.PositiveIntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='prep_time',
            field=models.PositiveIntegerField(default=1),
        ),
    ]