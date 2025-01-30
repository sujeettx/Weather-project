# Weather App

A simple and responsive weather application built using **HTML, CSS, and JavaScript**, allowing users to fetch real-time weather data by searching for a city.

## Features

- Fetch real-time weather data using **Weather API**
- Search weather by city name
- Display temperature, humidity, wind speed, and weather conditions
- User-friendly and **responsive design** for all devices

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **API**: Weather API (e.g., WeatherAPI.com)

## Installation & Setup

### 1. Clone the Repository

```sh
git clone https://github.com/your-username/weather-app.git
cd weather-app
```

### 2. Install Dependencies (if any)

This project uses only vanilla JavaScript, so no additional dependencies are required.

### 3. Create Configuration File

- Create a new file named `config.js` in the root directory.

### 4. Configuration

- Open `config.js` and replace the `API_KEY` with your actual key:

```js
// Config
const CONFIG = {
    API_KEY: 'your_api_key_here',  
    BASE_URL: 'https://api.weatherapi.com/v1',
    DEFAULT_LOCATION: 'London'
};

module.exports = CONFIG;
```

- **Note**: The `config.js` file is added to `.gitignore` to prevent exposing the API key publicly.

### 5. Run the Application

Simply open the `index.html` file in your browser to run the application.

## Project Structure

```
weather-app/
│-- assets/
│   ├── styles.css
│-- config.js (ignored in .gitignore)
│-- app.js
│-- index.html
│-- .gitignore
│-- README.md
```

## Deployment

You can deploy the app using **Netlify, GitHub Pages, or any static hosting service**.

### Deploy on GitHub Pages:

1. Push the code to GitHub
2. Go to **Repository Settings → Pages**
3. Select the branch to deploy
4. Save and visit the generated link

## License

This project is **open-source** and free to use.

