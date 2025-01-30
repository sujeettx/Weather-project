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

### 2. Install Dependencies

This project requires `dotenv` for environment variable management. Install it using:

```sh
npm install dotenv
```

### 3. Create `.env` File

Create a `.env` file in the root directory and add your API key:

```env
API_KEY=your_api_key_here
BASE_URL=https://api.weatherapi.com/v1
DEFAULT_LOCATION=London
```

- **Note**: The `.env` file is added to `.gitignore` to prevent exposing the API key publicly.

### 4. Run the Application

Simply open the `index.html` file in your browser to run the application.

## Project Structure

```
weather-app/
│-- styles.css
│-- app.js
│-- index.html
|-- config.js
│-- .env (ignored in .gitignore)
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

