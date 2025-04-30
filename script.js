const select = document.getElementById('location-select');
const resultsDiv = document.getElementById('results');
const placeholder = document.getElementById('placeholder');

// Predefined locations with coordinates
const locations = [
  { name: "Chicago", lat: "41.8781", lon: "-87.6298" },
  { name: "New York", lat: "40.7128", lon: "-74.0060" },
  { name: "Los Angeles", lat: "34.0522", lon: "-118.2437" },
  { name: "London", lat: "51.5074", lon: "-0.1278" },
  { name: "Paris", lat: "48.8566", lon: "2.3522" },
  { name: "Tokyo", lat: "35.6895", lon: "139.6917" },
  { name: "Sydney", lat: "-33.8688", lon: "151.2093" },
  { name: "Berlin", lat: "52.5200", lon: "13.4050" },
  { name: "Miami", lat: "25.7617", lon: "-80.1918" },
  { name: "Dubai", lat: "25.2048", lon: "55.2708" }
];

// Populate dropdown
locations.forEach(loc => {
  const option = document.createElement('option');
  option.value = `${loc.lat},${loc.lon}`;
  option.textContent = loc.name;
  select.appendChild(option);
});

// Handle selection change
select.addEventListener('change', () => {
  const [lat, lon] = select.value.split(',');
  fetchSunlightData(lat, lon);
});

// Fetch data from API with CORS proxy
function fetchSunlightData(lat, lon) {
  const url = `https://cors-anywhere.herokuapp.com/https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}`;

  fetch(url)
    .then(res => {
      console.log('Response:', res); // Check the response object
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log('API Data:', data); // Check the parsed JSON
      showResults(data);
    })
    .catch(err => {
      console.error('Error fetching data:', err); // Log the error
      showError("Failed to fetch data. Please try again.");
    });
}

// Display results
function showResults(data) {
  placeholder.style.display = 'none';
  resultsDiv.innerHTML = '';

  ['today', 'tomorrow'].forEach(dateKey => {
    const day = data.results[dateKey];
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <h2>${dateKey.charAt(0).toUpperCase() + dateKey.slice(1)}</h2>
      <p><strong>Sunrise:</strong> ${day.sunrise}</p>
      <p><strong>Sunset:</strong> ${day.sunset}</p>
      <p><strong>Dawn:</strong> ${day.dawn}</p>
      <p><strong>Dusk:</strong> ${day.dusk}</p>
      <p><strong>Day Length:</strong> ${day.day_length}</p>
      <p><strong>Solar Noon:</strong> ${day.solar_noon}</p>
      <p><strong>Timezone:</strong> ${data.results.timezone}</p>
    `;
    resultsDiv.appendChild(card);
  });
}

// Show error message
function showError(message) {
  resultsDiv.innerHTML = `<div class="error">${message}</div>`;
  placeholder.style.display = 'none';
}