
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Cloud, Wind, Droplets, Thermometer, 
  MapPin, Sparkles, Navigation, RefreshCw,
  Sun, Shirt, Activity, ShieldAlert, Layout,
  Wind as AirIcon
} from 'lucide-react';
import { getWeatherData } from './services/weatherService';
import { getAIWeatherInsights } from './services/geminiService';
import { WeatherData, AIInsight, GeocodingResult } from './types';
import { WEATHER_INTERPRETATION } from './constants';
import SearchBar from './components/SearchBar';
import ForecastChart from './components/ForecastChart';
import WeatherWidgets from './components/WeatherWidgets';

const getAQIStatus = (aqi: number) => {
  if (aqi <= 50) return { label: 'Good', color: 'text-emerald-400', bg: 'bg-emerald-400/20' };
  if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'text-orange-400', bg: 'bg-orange-400/20' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-400', bg: 'bg-red-400/20' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: 'text-purple-400', bg: 'bg-purple-400/20' };
  return { label: 'Hazardous', color: 'text-rose-600', bg: 'bg-rose-600/20' };
};

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [insights, setInsights] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showWidgets, setShowWidgets] = useState(false);

  const fetchFullWeather = useCallback(async (lat: number, lon: number, name: string, country: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherData(lat, lon, name, country);
      setWeather(data);
      const aiResponse = await getAIWeatherInsights(data);
      setInsights(aiResponse);
    } catch (err) {
      setError("Unable to fetch weather and air quality data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchFullWeather(pos.coords.latitude, pos.coords.longitude, "Current Location", "");
        },
        () => {
          fetchFullWeather(40.7128, -74.0060, "New York", "USA");
        }
      );
    } else {
      fetchFullWeather(40.7128, -74.0060, "New York", "USA");
    }
  }, [fetchFullWeather]);

  const handleCitySelect = (city: GeocodingResult) => {
    fetchFullWeather(city.latitude, city.longitude, city.name, city.country);
  };

  const handleRefresh = () => {
    if (weather) {
      setRefreshing(true);
      fetchFullWeather(weather.location.latitude, weather.location.longitude, weather.location.name, weather.location.country);
    }
  };

  if (loading && !weather) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 flex-col gap-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-pulse">Scanning the skies...</p>
      </div>
    );
  }

  const WeatherIcon = weather ? (WEATHER_INTERPRETATION[weather.current.weatherCode]?.icon || Cloud) : Cloud;
  const weatherLabel = weather ? (WEATHER_INTERPRETATION[weather.current.weatherCode]?.label || "Cloudy") : "Cloudy";
  const aqiInfo = weather ? getAQIStatus(weather.current.aqi) : null;

  return (
    <div className="min-h-screen bg-slate-950 pb-12 overflow-x-hidden">
      <div className={`fixed inset-0 opacity-20 pointer-events-none transition-colors duration-1000 ${
        weather?.current.isDay ? 'bg-blue-500' : 'bg-indigo-950'
      }`}></div>

      <div className="max-w-6xl mx-auto px-4 pt-8 relative z-10">
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-2xl">
              <Cloud className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">RT Weather</h1>
              <p className="text-slate-500 text-sm font-medium">Hyperlocal Intelligence</p>
            </div>
          </div>
          
          <div className="w-full md:w-auto flex-1 md:max-w-md">
            <SearchBar onSelectCity={handleCitySelect} />
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setShowWidgets(!showWidgets)}
              className={`p-3 border rounded-2xl transition-all flex items-center gap-2 font-medium ${
                showWidgets 
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' 
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700/50'
              }`}
              title="Widget Gallery"
            >
              <Layout className="h-5 w-5" />
              <span className="hidden sm:inline">Widgets</span>
            </button>
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-2xl transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 text-slate-400 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
            <ShieldAlert className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {weather && (
          <>
            {showWidgets ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-3xl font-bold text-white">Widget Gallery</h2>
                   <button 
                     onClick={() => setShowWidgets(false)}
                     className="text-slate-400 hover:text-white transition-colors"
                   >
                     Back to Dashboard
                   </button>
                </div>
                <WeatherWidgets weather={weather} />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
                <div className="lg:col-span-8 space-y-6">
                  <section className="glass rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                      <div>
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-lg font-medium">{weather.location.name}</span>
                        </div>
                        <div className="text-8xl md:text-9xl font-bold text-white mb-4 tracking-tighter">
                          {Math.round(weather.current.temp)}°
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="px-4 py-1.5 bg-blue-500/20 border border-blue-500/20 rounded-full text-blue-400 font-semibold text-sm">
                            {weatherLabel}
                          </div>
                          <div className="text-slate-400 font-medium">
                            H: {Math.round(weather.daily[0].maxTemp)}° L: {Math.round(weather.daily[0].minTemp)}°
                          </div>
                          {aqiInfo && (
                            <div className={`px-4 py-1.5 ${aqiInfo.bg} border border-white/10 rounded-full ${aqiInfo.color} font-semibold text-sm flex items-center gap-2`}>
                              <AirIcon className="h-3.5 w-3.5" />
                              AQI: {weather.current.aqi} ({aqiInfo.label})
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <WeatherIcon className="h-32 w-32 md:h-48 md:w-48 text-white drop-shadow-2xl animate-pulse" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-12 border-t border-slate-800/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-800/50 rounded-xl">
                          <Thermometer className="h-5 w-5 text-orange-400" />
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Feels Like</p>
                          <p className="text-white font-bold">{Math.round(weather.current.feelsLike)}°</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-800/50 rounded-xl">
                          <Droplets className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Humidity</p>
                          <p className="text-white font-bold">{weather.current.humidity}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-800/50 rounded-xl">
                          <Wind className="h-5 w-5 text-teal-400" />
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Wind Speed</p>
                          <p className="text-white font-bold">{weather.current.windSpeed} km/h</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-800/50 rounded-xl">
                          <Navigation className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">UV Index</p>
                          <p className="text-white font-bold">{weather.daily[0].uvIndex}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="glass rounded-[2.5rem] p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-400" />
                        Hourly Forecast
                      </h3>
                      <span className="text-slate-500 text-sm">Next 24 Hours</span>
                    </div>
                    <ForecastChart data={weather.hourly} />
                  </section>

                  <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
                    {weather.daily.slice(1, 8).map((day, idx) => {
                      const DayIcon = WEATHER_INTERPRETATION[day.weatherCode]?.icon || Cloud;
                      return (
                        <div key={idx} className="glass rounded-3xl p-5 text-center flex flex-col items-center gap-3 hover:bg-white/10 transition-colors cursor-default group">
                          <p className="text-slate-400 text-sm font-medium">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </p>
                          <DayIcon className="h-8 w-8 text-blue-400 group-hover:scale-110 transition-transform" />
                          <div className="space-y-1">
                            <p className="text-white font-bold">{Math.round(day.maxTemp)}°</p>
                            <p className="text-slate-500 text-sm">{Math.round(day.minTemp)}°</p>
                          </div>
                        </div>
                      );
                    })}
                  </section>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-500/20 sticky top-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-white">AI Insights</h2>
                    </div>

                    {!insights ? (
                      <div className="space-y-4 animate-pulse">
                        <div className="h-20 bg-white/10 rounded-2xl"></div>
                        <div className="h-32 bg-white/10 rounded-2xl"></div>
                        <div className="h-32 bg-white/10 rounded-2xl"></div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div>
                          <p className="text-blue-100/80 text-sm font-semibold uppercase tracking-wider mb-3">Weather Summary</p>
                          <p className="text-white text-lg leading-relaxed font-medium">{insights.summary}</p>
                        </div>

                        <div className="p-6 bg-white/10 rounded-3xl border border-white/10">
                          <div className="flex items-center gap-3 mb-3">
                            <Shirt className="h-5 w-5 text-blue-200" />
                            <h4 className="text-white font-bold">What to Wear</h4>
                          </div>
                          <p className="text-blue-50 leading-relaxed text-sm">{insights.clothing}</p>
                        </div>

                        <div className="p-6 bg-white/10 rounded-3xl border border-white/10">
                          <div className="flex items-center gap-3 mb-3">
                            <Activity className="h-5 w-5 text-blue-200" />
                            <h4 className="text-white font-bold">Best Activities</h4>
                          </div>
                          <ul className="space-y-2">
                            {insights.activities.map((activity, idx) => (
                              <li key={idx} className="text-blue-50 text-sm flex items-center gap-2">
                                <div className="h-1 w-1 bg-blue-300 rounded-full" />
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-6 bg-amber-400/20 rounded-3xl border border-amber-400/20">
                          <div className="flex items-center gap-3 mb-3">
                            <ShieldAlert className="h-5 w-5 text-amber-300" />
                            <h4 className="text-amber-100 font-bold">Health Tip</h4>
                          </div>
                          <p className="text-amber-50 leading-relaxed text-sm">{insights.healthTip}</p>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
