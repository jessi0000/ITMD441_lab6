document.addEventListener('DOMContentLoaded', () => {
  // DOM element references
  const select = document.getElementById('location-select');
  const resultsDiv = document.getElementById('results');
  const placeholder = document.getElementById('placeholder');

  // Predefined locations
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

  // Initialize dropdown
  function initDropdown() {
    locations.forEach(location => {
      const option = new Option(
        location.name,
        `${location.lat},${location.lon}`
      );
      select.add(option);
    });
  }

  // Handle location selection
  select.addEventListener('change', async () => {
    if (!select.value) {
      showPlaceholder();
      return;
    }
    
    try {
      const [lat, lon] = select.value.split(',');
      const data = await fetchSunData(lat, lon);
      showResults(data);
    } catch (error) {
      console.error('Error:', error);
      showError('Failed to fetch data. Please try again.');
    }
  });

  // Fetch sun data from API
  async function fetchSunData(lat, lon) {
    try {
      const [todayRes, tomorrowRes] = await Promise.all([
        fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}&date=today&formatted=0`),
        fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}&date=tomorrow&formatted=0`)
      ]);

      if (!todayRes.ok || !tomorrowRes.ok) {
        throw new Error(`HTTP error: ${todayRes.status}/${tomorrowRes.status}`);
      }

      const todayData = await todayRes.json();
      const tomorrowData = await tomorrowRes.json();

      if (todayData.status !== 'OK' || tomorrowData.status !== 'OK') {
        throw new Error('API returned error status');
      }

      return {
        today: todayData.results,
        tomorrow: tomorrowData.results,
        timezone: todayData.results.timezone
      };
    } catch (error) {
      throw new Error(`Data fetch failed: ${error.message}`);
    }
  }

  // Display results
  function showResults(data) {
    placeholder.style.display = 'none';
    resultsDiv.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'cards-container';

    ['today', 'tomorrow'].forEach(day => {
      const card = createDayCard(day, data);
      container.appendChild(card);
    });

    resultsDiv.appendChild(container);
  }

  // Create day card
  function createDayCard(dayKey, data) {
    const dayData = data[dayKey];
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <h2>${dayKey.charAt(0).toUpperCase() + dayKey.slice(1)}</h2>
      <div class="card-content">
        <p><span>🌅 Sunrise:</span> ${dayData.sunrise}</p>
        <p><span>🌇 Sunset:</span> ${dayData.sunset}</p>
        <p><span>🌄 Dawn:</span> ${dayData.dawn}</p>
        <p><span>🌆 Dusk:</span> ${dayData.dusk}</p>
        <p><span>⏳ Day Length:</span> ${dayData.day_length}</p>
        <p><span>☀️ Solar Noon:</span> ${dayData.solar_noon}</p>
        <p class="timezone"><span>🌐 Timezone:</span> ${data.timezone}</p>
      </div>
    `;

    return card;
  }

  // Format time string
  function formatTime(isoString, timezone) {
    try {
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: timezone
      };
      return new Date(isoString).toLocaleTimeString([], options);
    } catch {
      return isoString.split('T')[1].slice(0,5); // Fallback format
    }
  }

  // Format duration
  function formatDuration(duration) {
    const [hours, minutes] = duration.split(':');
    return `${hours}h ${minutes}m`;
  }

  // Show error message
  function showError(message) {
    resultsDiv.innerHTML = `
      <div class="error">
        <span>⚠️</span>
        <p>${message}</p>
      </div>
    `;
    placeholder.style.display = 'none';
  }

  // Show placeholder
  function showPlaceholder() {
    resultsDiv.innerHTML = '';
    placeholder.style.display = 'block';
  }

  // Initialize app
  initDropdown();
});