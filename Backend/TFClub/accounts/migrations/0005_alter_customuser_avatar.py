# Generated by Django 4.1.3 on 2022-12-09 07:30

import accounts.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_alter_customuser_phone_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='avatar',
            field=models.FileField(default='posts/default.jpg', null=True, upload_to=accounts.models.upload_to),
        ),
    ]
