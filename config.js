require('dotenv').config();
const CONFIG = {
    API_KEY: process.env.API_KEY,
    BASE_URL: process.env.BASE_URL,
    DEFAULT_LOCATION: process.env.DEFAULT_LOCATION
};

module.exports = CONFIG;