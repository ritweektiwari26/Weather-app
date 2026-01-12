
import { WeatherData, GeocodingResult } from '../types';

export const searchCity = async (name: string): Promise<GeocodingResult[]> => {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=5&language=en&format=json`);
  const data = await response.json();
  return data.results || [];
};

export const getWeatherData = async (lat: number, lon: number, name: string, country: string): Promise<WeatherData> => {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&hourly=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`;
  
  const [weatherResponse, aqiResponse] = await Promise.all([
    fetch(weatherUrl),
    fetch(aqiUrl)
  ]);
  
  const weatherData = await weatherResponse.json();
  const aqiData = await aqiResponse.json();

  return {
    current: {
      temp: weatherData.current.temperature_2m,
      humidity: weatherData.current.relative_humidity_2m,
      feelsLike: weatherData.current.apparent_temperature,
      windSpeed: weatherData.current.wind_speed_10m,
      condition: 'Unknown', 
      weatherCode: weatherData.current.weather_code,
      isDay: weatherData.current.is_day === 1,
      aqi: aqiData.current.us_aqi,
    },
    daily: weatherData.daily.time.map((time: string, i: number) => ({
      date: time,
      maxTemp: weatherData.daily.temperature_2m_max[i],
      minTemp: weatherData.daily.temperature_2m_min[i],
      weatherCode: weatherData.daily.weather_code[i],
      uvIndex: weatherData.daily.uv_index_max[i],
    })),
    hourly: weatherData.hourly.time.slice(0, 24).map((time: string, i: number) => ({
      time: time,
      temp: weatherData.hourly.temperature_2m[i],
    })),
    location: {
      name,
      country,
      latitude: lat,
      longitude: lon,
    }
  };
};
