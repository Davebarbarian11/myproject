let humedadData = [
    { id: 'h1_sensor2', data: [1, 99] },
    { id: 'h2_sensor2', data: [40, 60] },
    { id: 'h3_sensor2', data: [20, 80] },
    { id: 'h1_sensor1', data: [56, 44] },
    { id: 'h2_sensor1', data: [48, 52] },
    { id: 'h3_sensor1', data: [25, 75] }
];
let charts = {}; // Object to store chart instances
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
// HUMEDAD
function createChartHumedad(elementId, data, backgroundColor = ['#2d9f21', '#f6f1f151']) {
    const ctx = document.getElementById(elementId).getContext('2d');
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: data,
                backgroundColor: backgroundColor,
                borderColor: 'rgba(0, 0, 0, 0)'
            }],
            labels: ['Humidity', 'Remaining']
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        },
        plugins: [{
            afterDraw: function(chart) {
                if (chart.data.datasets && chart.data.datasets[0]) {
                    const ctx = chart.ctx;
                    const value = chart.data.datasets[0].data[0];
                    const cx = chart.chartArea.left + chart.chartArea.width / 2;
                    const cy = chart.chartArea.top + chart.chartArea.height / 2;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = '20px Arial';
                    ctx.fillStyle = 'black';
                    ctx.fillText(value + '%', cx, cy);
                }
            }
        }],
    });

    ctx.canvas.addEventListener('mouseenter', () => {
        chart.data.datasets[0].backgroundColor = ['#ff5722', '#f6f1f151'];
        chart.update();
    });

    ctx.canvas.addEventListener('mouseleave', () => {
        chart.data.datasets[0].backgroundColor = backgroundColor;
        chart.update();
    });
    charts[elementId] = chart;
    return chart;
}
// Actualizar datos de los sensores de humedad
function updateSensorData(sensorId, humidityKey, data, humedadData, charts) {
    const sensorIndex = humedadData.findIndex(sensor => sensor.id === sensorId);
    if (sensorIndex !== -1) {
        const humidityValue = parseFloat(data[humidityKey]);
        humedadData[sensorIndex].data = [humidityValue, 100 - humidityValue];
        console.log(sensorId, humedadData[sensorIndex].data);
        const chart = charts[sensorId];
        if (chart) {
            chart.data.datasets[0].data = [humidityValue, 100 - humidityValue];
            chart.update();
        }
    }
}
function sendDateToServer(selectedDate, startTime, duration) {
  fetch('/save_date/', {  // Use the correct path as defined in urls.py
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-CSRFToken': getCookie('csrftoken')  // Function to get CSRF token from cookies
    },
    body: `selectedDate=${selectedDate}&startTime=${startTime}&duration=${duration}`
  })
  .then(response => {
    console.log('Response:', duration);
    console.log('Response:', startTime);
    console.log('Response:', selectedDate);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch((error) => {
    console.error('Error:', error);
  });
}

// CALENDARIO
document.addEventListener('DOMContentLoaded', function() {
  let selectedDate = null; // Variable to store the selected date
  let startTime = null;
  let duration = null;
  let lastEventId = null; // Variable to store the ID of the last event
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
      locale: 'es', // Set calendar language to Spanish
      initialView: 'dayGridMonth',
      selectable: true,
      headerToolbar: {
          left: 'title', // Move the title to the left
          center: '',
          right: 'prev,next' // Move navigation buttons to the right
      },
      dateClick: function(info) {
        selectedDate = info.dateStr; // Save the selected date
        const hour = prompt("Enter the start hour for the event (0-23):", "12"); // Prompt user to enter start hour
        const hourInt = parseInt(hour, 10);

        // Validate the entered hour and ensure it's within 0-23
        if (!isNaN(hourInt) && hourInt >= 0 && hourInt < 24) {
          // Combine the selected date with the entered hour to form startTime
          startTime = selectedDate + 'T' + (hour < 10 ? '0' + hour : hour) + ':00:00'; // Adjust for leading zero if needed

          duration = prompt("Enter duration in hours for the event:", "2"); // Prompt user to enter duration
          alert("Start time: " + startTime + ", Duration: " + duration + " hours");

          if (lastEventId) {
            calendar.getEventById(lastEventId).remove();
          }

          sendDateToServer(selectedDate, startTime, duration);

          const newEvent = calendar.addEvent({
            id: Date.now().toString(), // Use the current timestamp as a unique ID
            title: "New Event",
            start: startTime,
            end: new Date(new Date(startTime).getTime() + duration * 60 * 60 * 1000).toISOString(),
          });

          lastEventId = newEvent.id;
        } else {
          alert("Invalid hour entered. Please enter a value between 0 and 23.");
        }
      },
      eventClick: function(info) {
        const eventObj = info.event;
        const startTime = eventObj.start.toISOString();
        let duration = (eventObj.end - eventObj.start) / (1000 * 60 * 60); // Calculate duration in hours
        if (!duration) { // If duration is not set, default to 0 or handle accordingly
          duration = 0;
        }
        alert("Event Start Time: " + startTime + ", Duration: " + duration + " hours");
        sendDateToServer(selectedDate, startTime, duration);

      },
      // Customizing colors directly in the initialization
      eventColor: '#378006', // Example event color
      eventBackgroundColor: '#378006', // Background color for events
      eventBorderColor: '#257000', // Border color for events
      eventTextColor: '#ffffff', // Text color for events
      dayMaxEventRows: true, // for all non-TimeGrid views
      views: {
          timeGrid: {
              dayMaxEventRows: 6 // adjust to 6 only for timeGridWeek/timeGridDay
          }
      },
      themeSystem: 'bootstrap', // Optional: if you want to use Bootstrap's theming
  });
  calendar.render();
});

// FETCH SENSOR DATA
document.addEventListener("DOMContentLoaded", function() {
    function fetchSensorData() {
      fetch('/get-sensor-data/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('battery-level').textContent = data.battery_level_1;
            console.log('battery-level element:', document.getElementById('battery-level'));

            document.getElementById('battery-level-2').textContent = data.battery_level_2;
            console.log('battery-level-2 element:', document.getElementById('battery-level-2'));

            updateSensorData('h1_sensor1', 'humidity_25_1', data, humedadData, charts);
            updateSensorData('h2_sensor1', 'humidity_50_1', data, humedadData, charts);
            updateSensorData('h3_sensor1', 'humidity_75_1', data, humedadData, charts);
            updateSensorData('h1_sensor2', 'humidity_25_2', data, humedadData, charts);
            updateSensorData('h2_sensor2', 'humidity_50_2', data, humedadData, charts);
            updateSensorData('h3_sensor2', 'humidity_75_2', data, humedadData, charts);

            document.getElementById('electrical-conductivity').textContent = data.electrical_conductivity_1;
            console.log('electrical-conductivity element', document.getElementById('electrical-conductivity'));
            document.getElementById('electrical-conductivity-2').textContent = data.electrical_conductivity_2;
            console.log('electrical-conductivity-2 element', document.getElementById('electrical-conductivity-2'));
        })
        .catch(error => console.error('Error fetching sensor data:', error));
    }
    // Fetch the sensor data immediately and then every 60 seconds
    fetchSensorData();
    console.log('Humedad_data: ', humedadData);
    humedadData.forEach(h => createChartHumedad(h.id, h.data));
    setInterval(fetchSensorData, 10000);
  });
