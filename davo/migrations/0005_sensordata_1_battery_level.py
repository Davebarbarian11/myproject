# Generated by Django 4.2.13 on 2024-06-21 21:07

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("davo", "0004_remove_sensordata_1_battery_level"),
    ]

    operations = [
        migrations.AddField(
            model_name="sensordata_1",
            name="battery_level",
            field=models.DecimalField(decimal_places=1, default=5, max_digits=3),
            preserve_default=False,
        ),
    ]
