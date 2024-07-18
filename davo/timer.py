from datetime import datetime
import time

# Get the current date and time
now = datetime.now()

# Format the date and time
formatted_now = now.strftime("%Y-%m-%d %H:%M:%S")

# Print the formatted date and time
print("Current date and time:", formatted_now)

n = 0
Date = ["2024-07-13 12:32:00", '50']

if formatted_now == Date[0]:
    while int(Date[1]) > n:
        print("Time is up!")
        n += 1
        time.sleep(1)  # Add a delay of 1 second
else:
    print("Time is not up yet!")
