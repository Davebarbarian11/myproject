from django.utils import timezone
from .models import SensorData_1, SensorData_2

# Example data for SensorData_1
sensor_data_1_entries = [
    {'battery_level': 95.0, 'humidity_25': 30.2, 'humidity_50': 45.5, 'humidity_75': 55.1, 'electrical_conductivity': 1.2},
    # Add more entries as needed
]

# Example data for SensorData_2 (assuming similar fields)
sensor_data_2_entries = [
    {'battery_level': 90.0, 'humidity_25': 32.5, 'humidity_50': 47.0, 'humidity_75': 56.4, 'electrical_conductivity': 1.3},
    # Add more entries as needed
]

# Insert data into SensorData_1
for entry in sensor_data_1_entries:
    SensorData_1.objects.create(**entry, timestamp=timezone.now()).save()

# Insert data into SensorData_2
for entry in sensor_data_2_entries:
    SensorData_2.objects.create(**entry, timestamp=timezone.now()).save()
