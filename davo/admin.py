from django.contrib import admin
from .models import Feature
from .models import SensorData_1, SensorData_2, OnOff, RiegoSchedule




# Register your models here.
admin.site.register(Feature)
admin.site.register(SensorData_1)
admin.site.register(SensorData_2)
admin.site.register(OnOff)
admin.site.register(RiegoSchedule)
