// Config
const CONFIG = {
  API_KEY: '2a076f927ed74dfa9a794530240108',
  BASE_URL: 'https://api.weatherapi.com/v1',
  DEFAULT_LOCATION: 'London'
};

// Weather icon mapping object
const WEATHER_ICONS = {
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

// UI Elements Manager
const UI = {
  elements: {
      searchInput: document.querySelector('.search-bar input'),
      refreshBtn: document.querySelector('.refresh-btn'),
      weatherIcon: document.querySelector('.weather-icon i'),
      temperature: document.querySelector('.temperature'),
      datetime: document.querySelector('.datetime'),
      condition: document.querySelector('.condition span'),
      location: document.querySelector('.location span'),
      precipitation: document.querySelector('.precipitation span'),
      windValue: document.querySelector('.wind-value'),
      windDirection: document.querySelector('.wind-direction span'),
      humidityValue: document.querySelector('.humidity-value'),
      humidityStatus: document.querySelector('.humidity-status'),
      uvValue: document.querySelector('.uv-value'),
      aqiValue: document.querySelector('.highlight-value'),
      aqiStatus: document.querySelector('.highlight-status')
  },

  showLoader() {
      document.body.classList.add('loading');
  },

  hideLoader() {
      document.body.classList.remove('loading');
  },

  showMessage(message, type = 'success') {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${type}`;
      messageDiv.textContent = message;
      document.body.appendChild(messageDiv);
      
      setTimeout(() => {
          messageDiv.classList.add('fade-out');
          setTimeout(() => messageDiv.remove(), 300);
      }, 2700);
  },

  showError(message) {
      this.showMessage(message, 'error');
  }
};

// Weather Data Manager
const WeatherManager = {
  async getCurrentLocation() {
      return new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
              reject(new Error('Geolocation is not supported by your browser'));
              return;
          }

          navigator.geolocation.getCurrentPosition(
              position => {
                  const { latitude, longitude } = position.coords;
                  resolve(`${latitude},${longitude}`);
              },
              () => {
                  reject(new Error('Unable to get your location'));
              }
          );
      });
  },

  async fetchWeatherData(query) {
      const response = await fetch(
          `${CONFIG.BASE_URL}/current.json?key=${CONFIG.API_KEY}&q=${query}&aqi=yes`
      );
      
      if (!response.ok) {
          throw new Error('Location not found. Please try again.');
      }
      
      return response.json();
  }
};

// Weather UI Updater
const WeatherUIUpdater = {
  formatDateTime(datetime) {
      const date = new Date(datetime);
      return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
      });
  },

  getHumidityStatus(humidity) {
      if (humidity <= 30) return 'Low';
      if (humidity <= 60) return 'Moderate';
      return 'High';
  },

  getAQIStatus(aqi) {
      if (aqi <= 50) return 'Good';
      if (aqi <= 100) return 'Moderate';
      if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
      if (aqi <= 200) return 'Unhealthy';
      if (aqi <= 300) return 'Very Unhealthy';
      return 'Hazardous';
  },

  updateUVIndicator(uvIndex) {
      const indicator = document.querySelector('.uv-indicator');
      const percentage = (uvIndex / 11) * 100;
      indicator.style.left = `${Math.min(percentage, 100)}%`;
      
      const colors = {
          2: '#558B2F',
          5: '#F9A825',
          7: '#EF6C00',
          10: '#B71C1C',
          Infinity: '#6A1B9A'
      };

      for (const [threshold, color] of Object.entries(colors)) {
          if (uvIndex <= Number(threshold)) {
              indicator.style.backgroundColor = color;
              break;
          }
      }
  },

  updateUI(data) {
      const { current, location } = data;
      const elements = UI.elements;
      
      // Update weather icon
      const condition = current.condition.text.toLowerCase();
      elements.weatherIcon.className = `wi ${WEATHER_ICONS[condition] || 'wi-day-sunny'}`;
      
      // Update main weather info
      elements.temperature.textContent = `${Math.round(current.temp_c)}°C`;
      elements.datetime.textContent = this.formatDateTime(location.localtime);
      elements.condition.textContent = current.condition.text;
      elements.location.textContent = `${location.name}, ${location.country}`;
      elements.precipitation.textContent = current.precip_mm > 0 ? 
          `Rain - ${current.precip_mm}mm` : 'No precipitation';
      
      // Update highlights
      this.updateHighlights(current);
      
      // Add fade-in animation
      document.querySelectorAll('.highlight-card').forEach(card => {
          card.classList.add('fade-in');
      });
  },

  updateHighlights(current) {
      const elements = UI.elements;
      
      // Wind
      elements.windValue.textContent = current.wind_kph.toFixed(1);
      elements.windDirection.textContent = current.wind_dir;
      
      // Humidity
      elements.humidityValue.textContent = `${current.humidity}%`;
      elements.humidityStatus.textContent = this.getHumidityStatus(current.humidity);
      
      // UV Index
      elements.uvValue.textContent = current.uv;
      this.updateUVIndicator(current.uv);
      
      // Air Quality
      if (current.air_quality) {
          const pm2_5 = Math.round(current.air_quality.pm2_5);
          elements.aqiValue.textContent = pm2_5;
          elements.aqiStatus.textContent = this.getAQIStatus(pm2_5);
      } else {
          elements.aqiValue.textContent = 'N/A';
          elements.aqiStatus.textContent = 'Not available';
      }
  }
};

// App initialization and event handlers
async function initWeatherApp() {
  try {
      UI.showLoader();
      const location = await WeatherManager.getCurrentLocation();
      const weatherData = await WeatherManager.fetchWeatherData(location);
      WeatherUIUpdater.updateUI(weatherData);
      UI.showMessage('Weather updated successfully');
  } catch (error) {
      console.error('Error initializing weather app:', error);
      // Fallback to default location
      getWeatherData(CONFIG.DEFAULT_LOCATION);
  } finally {
      UI.hideLoader();
  }
}

async function getWeatherData(query) {
  try {
      UI.showLoader();
      const data = await WeatherManager.fetchWeatherData(query);
      WeatherUIUpdater.updateUI(data);
      UI.hideLoader();
      UI.showMessage('Weather updated successfully');
  } catch (error) {
      UI.hideLoader();
      UI.showError(error.message);
  }
}

// Event Listeners
function setupEventListeners() {
  UI.elements.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && e.target.value) {
          getWeatherData(e.target.value);
      }
  });

  UI.elements.refreshBtn.addEventListener('click', () => {
      const query = UI.elements.searchInput.value;
      if (query) {
          getWeatherData(query);
      }
  });
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  initWeatherApp();
});