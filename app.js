// Weather icon mappings
const weatherIcons = {
  'clear': 'wi-day-sunny',
  'sunny': 'wi-day-sunny',
  'partly cloudy': 'wi-day-cloudy',
  'cloudy': 'wi-cloudy',
  'overcast': 'wi-cloudy',
  'mist': 'wi-fog',
  'fog': 'wi-fog',
  'light rain': 'wi-rain',
  'moderate rain': 'wi-rain',
  'heavy rain': 'wi-rain',
  'light snow': 'wi-snow',
  'moderate snow': 'wi-snow',
  'heavy snow': 'wi-snow',
  'thunder': 'wi-thunderstorm',
  'thunderstorm': 'wi-thunderstorm'
};

// API Configuration
const API_KEY = '2a076f927ed74dfa9a794530240108';
const BASE_URL = 'https://api.weatherapi.com/v1';

// DOM Elements
const searchInput = document.querySelector('.search-bar input');
const refreshBtn = document.querySelector('.refresh-btn');
const weatherIcon = document.querySelector('.weather-icon i');
const temperatureEl = document.querySelector('.temperature');
const datetimeEl = document.querySelector('.datetime');
const conditionEl = document.querySelector('.condition span');
const locationEl = document.querySelector('.location span');
const precipitationEl = document.querySelector('.precipitation span');
const windValueEl = document.querySelector('.wind-value');
const windDirectionEl = document.querySelector('.wind-direction span');
const humidityValueEl = document.querySelector('.humidity-value');
const humidityStatusEl = document.querySelector('.humidity-status');
const uvValueEl = document.querySelector('.uv-value');
const aqiValueEl = document.querySelector('.highlight-value');
const aqiStatusEl = document.querySelector('.highlight-status');

// Utility Functions
function formatDateTime(datetime) {
  const date = new Date(datetime);
  return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
  });
}

function getHumidityStatus(humidity) {
  if (humidity <= 30) return 'Low';
  if (humidity <= 60) return 'Moderate';
  return 'High';
}

function getAQIStatus(aqi) {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

function updateUVIndicator(uvIndex) {
  const indicator = document.querySelector('.uv-indicator');
  const percentage = (uvIndex / 11) * 100;
  indicator.style.left = `${Math.min(percentage, 100)}%`;
  
  // Update color based on UV index
  if (uvIndex <= 2) indicator.style.backgroundColor = '#558B2F';
  else if (uvIndex <= 5) indicator.style.backgroundColor = '#F9A825';
  else if (uvIndex <= 7) indicator.style.backgroundColor = '#EF6C00';
  else if (uvIndex <= 10) indicator.style.backgroundColor = '#B71C1C';
  else indicator.style.backgroundColor = '#6A1B9A';
}

// UI Feedback Functions
function showLoader() {
  document.body.classList.add('loading');
}

function hideLoader() {
  document.body.classList.remove('loading');
}

function showMessage(message, type = 'success') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);
  
  setTimeout(() => {
      messageDiv.remove();
  }, 3000);
}

function showError(message) {
  showMessage(message, 'error');
}

// Event Listeners
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
      getWeatherData(searchInput.value);
  }
});

refreshBtn.addEventListener('click', () => {
  if (searchInput.value) {
      getWeatherData(searchInput.value);
  }
});

// Fetch Weather Data
async function getWeatherData(query) {
  try {
      showLoader();
      const response = await fetch(
          `${BASE_URL}/current.json?key=${API_KEY}&q=${query}&aqi=yes`
      );
      
      if (!response.ok) {
          throw new Error('Location not found. Please try again.');
      }
      
      const data = await response.json();
      updateUI(data);
      hideLoader();
      showMessage('Weather updated successfully');
  } catch (error) {
      hideLoader();
      showError(error.message);
  }
}

// Update UI with Weather Data
function updateUI(data) {
  const { current, location } = data;
  
  // Update weather icon
  const condition = current.condition.text.toLowerCase();
  const iconClass = weatherIcons[condition] || 'wi-day-sunny';
  weatherIcon.className = `wi ${iconClass}`;
  
  // Update main weather info
  temperatureEl.textContent = `${Math.round(current.temp_c)}°C`;
  datetimeEl.textContent = formatDateTime(location.localtime);
  conditionEl.textContent = current.condition.text;
  locationEl.textContent = `${location.name}, ${location.country}`;
  precipitationEl.textContent = current.precip_mm > 0 ? 
      `Rain - ${current.precip_mm}mm` : 'No precipitation';
  
  // Update highlights
  updateHighlights(current);
  
  // Add fade-in animation
  document.querySelectorAll('.highlight-card').forEach(card => {
      card.classList.add('fade-in');
  });
}

// Update Highlights Section
function updateHighlights(current) {
  // Wind
  windValueEl.textContent = current.wind_kph.toFixed(1);
  windDirectionEl.textContent = current.wind_dir;
  
  // Humidity
  humidityValueEl.textContent = `${current.humidity}%`;
  humidityStatusEl.textContent = getHumidityStatus(current.humidity);
  
  // UV Index
  uvValueEl.textContent = current.uv;
  updateUVIndicator(current.uv);
  
  // Air Quality
  if (current.air_quality) {
      const pm2_5 = Math.round(current.air_quality.pm2_5);
      aqiValueEl.textContent = pm2_5;
      aqiStatusEl.textContent = getAQIStatus(pm2_5);
  } else {
      aqiValueEl.textContent = 'N/A';
      aqiStatusEl.textContent = 'Not available';
  }
}

// Initialize with default location
document.addEventListener('DOMContentLoaded', () => {
  getWeatherData('London');
});