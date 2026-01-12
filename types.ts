
export interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    feelsLike: number;
    windSpeed: number;
    condition: string;
    weatherCode: number;
    isDay: boolean;
    aqi: number; // US AQI
  };
  daily: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    weatherCode: number;
    uvIndex: number;
  }>;
  hourly: Array<{
    time: string;
    temp: number;
  }>;
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
}

export interface AIInsight {
  summary: string;
  clothing: string;
  activities: string[];
  healthTip: string;
}

export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}
