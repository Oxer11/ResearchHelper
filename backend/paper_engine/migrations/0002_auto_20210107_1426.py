# Generated by Django 3.1.4 on 2021-01-07 14:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('paper_engine', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='paper',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
