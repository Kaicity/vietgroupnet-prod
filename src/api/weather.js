import axios from 'axios';

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = '7f8e4e6f58103f97c35bf7087b7d9043';

export const fetchWeather = async (city) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        APPID: API_KEY,
        units: 'metric',
        lang: 'vi',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
