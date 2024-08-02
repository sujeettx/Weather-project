const button = document.getElementById("search-btn");
const input = document.getElementById("input-btn");
const cityName = document.getElementById("city-name");
const cityTime = document.getElementById("city-time");
const cityTemp = document.getElementById("city-temp");

const getData = async (query) => {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=2a076f927ed74dfa9a794530240108&q=${query}&aqi=yes`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

const displayWeather = (result) => {
  if (result) {
    cityName.innerText = `${result.location.name}, ${result.location.region} - ${result.location.country}`;
    cityTime.innerText = `${result.location.localtime}`;
    cityTemp.innerText = `${result.current.temp_c}°C`;
  } else {
    cityName.innerText = "No data available";
    cityTime.innerText = "";
    cityTemp.innerText = "";
  }
};

const fetchDefaultWeather = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const result = await getData(`${lat},${lon}`);
        displayWeather(result);
      },
      (error) => {
        console.error("Geolocation error:", error);
        cityName.innerText = "Unable to retrieve location";
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    cityName.innerText = "Geolocation not supported";
  }
};

button.addEventListener("click", async () => {
  const value = input.value.trim();
  if (value === "") {
    alert("Please enter a city name.");
    return;
  }
  const result = await getData(value);
  displayWeather(result);
});

fetchDefaultWeather();
