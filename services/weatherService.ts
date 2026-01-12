
import { WeatherData, GeocodingResult } from '../types';

export const searchCity = async (name: string): Promise<GeocodingResult[]> => {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=5&language=en&format=json`);
  const data = await response.json();
  return data.results || [];
};

export const getWeatherData = async (lat: number, lon: number, name: string, country: string): Promise<WeatherData> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&hourly=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;
  
  const response = await fetch(url);
  const data = await response.json();

  return {
    current: {
      temp: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      feelsLike: data.current.apparent_temperature,
      windSpeed: data.current.wind_speed_10m,
      condition: 'Unknown', // Will map via code
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
    },
    daily: data.daily.time.map((time: string, i: number) => ({
      date: time,
      maxTemp: data.daily.temperature_2m_max[i],
      minTemp: data.daily.temperature_2m_min[i],
      weatherCode: data.daily.weather_code[i],
      uvIndex: data.daily.uv_index_max[i],
    })),
    hourly: data.hourly.time.slice(0, 24).map((time: string, i: number) => ({
      time: time,
      temp: data.hourly.temperature_2m[i],
    })),
    location: {
      name,
      country,
      latitude: lat,
      longitude: lon,
    }
  };
};
