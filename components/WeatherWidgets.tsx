
import React from 'react';
import { Cloud, MapPin } from 'lucide-react';
import { WeatherData } from '../types';
import { WEATHER_INTERPRETATION } from '../constants';

interface WeatherWidgetsProps {
  weather: WeatherData;
}

const WeatherWidgets: React.FC<WeatherWidgetsProps> = ({ weather }) => {
  const WeatherIcon = WEATHER_INTERPRETATION[weather.current.weatherCode]?.icon || Cloud;
  const weatherLabel = WEATHER_INTERPRETATION[weather.current.weatherCode]?.label || "Cloudy";

  // Get next 4 hours for the forecast widget
  const nextHours = weather.hourly.slice(0, 4);

  return (
    <div className="space-y-12 py-8">
      <div>
        <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm">iOS</span>
          Widget System
        </h3>
        <div className="flex flex-wrap gap-8 items-start">
          {/* iOS Small Widget */}
          <div className="w-[158px] h-[158px] bg-gradient-to-br from-blue-400 to-blue-600 rounded-[30px] p-4 shadow-xl flex flex-col justify-between text-white overflow-hidden relative group cursor-pointer hover:scale-105 transition-transform">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[13px] font-bold opacity-90 truncate max-w-[80px]">{weather.location.name}</p>
                <p className="text-[28px] font-medium leading-none mt-1">{Math.round(weather.current.temp)}°</p>
              </div>
              <WeatherIcon className="h-8 w-8 text-white drop-shadow-md" />
            </div>
            <div>
              <p className="text-[11px] font-semibold">{weatherLabel}</p>
              <p className="text-[10px] font-medium opacity-80 mt-0.5">
                H:{Math.round(weather.daily[0].maxTemp)}° L:{Math.round(weather.daily[0].minTemp)}°
              </p>
            </div>
          </div>

          {/* iOS Medium Widget */}
          <div className="w-[327px] h-[158px] bg-gradient-to-br from-blue-500/90 to-indigo-600/90 backdrop-blur-md rounded-[30px] p-4 shadow-xl flex flex-col justify-between text-white overflow-hidden group cursor-pointer hover:scale-105 transition-transform">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <WeatherIcon className="h-10 w-10 text-white" />
                <div>
                  <p className="text-[13px] font-bold opacity-90">{weather.location.name}</p>
                  <p className="text-[24px] font-medium leading-none">{Math.round(weather.current.temp)}°</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold">{weatherLabel}</p>
                <p className="text-[10px] opacity-80 mt-0.5">Feels like {Math.round(weather.current.feelsLike)}°</p>
              </div>
            </div>
            <div className="flex justify-between px-2 mt-2">
              {nextHours.map((h, i) => (
                <div key={i} className="flex flex-col items-center">
                  <p className="text-[10px] font-bold opacity-70 mb-1">{new Date(h.time).getHours()}:00</p>
                  <p className="text-[12px] font-bold">{Math.round(h.temp)}°</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-sm text-blue-400 font-mono">A</span>
          Android Material You
        </h3>
        <div className="flex flex-wrap gap-8 items-start">
          {/* Android Pill Widget */}
          <div className="h-[80px] px-6 bg-[#D3E3FD] rounded-full flex items-center gap-4 shadow-lg cursor-pointer hover:scale-105 transition-transform group">
             <div className="w-10 h-10 bg-[#004A77] rounded-full flex items-center justify-center">
                <WeatherIcon className="h-6 w-6 text-white" />
             </div>
             <div className="flex flex-col">
                <span className="text-[#001D35] font-bold text-lg leading-tight">{Math.round(weather.current.temp)}°</span>
                <span className="text-[#001D35] text-xs font-medium opacity-80">{weather.location.name}</span>
             </div>
             <div className="ml-4 border-l border-[#001D35]/10 pl-4">
                <p className="text-[#001D35] text-xs font-bold">{weatherLabel}</p>
             </div>
          </div>

          {/* Android Shape Widget */}
          <div className="w-[180px] h-[180px] bg-[#EADDFF] rounded-[48px] p-6 flex flex-col justify-center items-center gap-2 shadow-lg text-[#21005D] relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <WeatherIcon className="h-24 w-24" />
            </div>
            <p className="text-sm font-bold opacity-60 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {weather.location.name}
            </p>
            <p className="text-5xl font-black">{Math.round(weather.current.temp)}°</p>
            <div className="flex flex-col items-center mt-1">
              <WeatherIcon className="h-8 w-8 mb-1" />
              <p className="text-xs font-bold uppercase tracking-wider">{weatherLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidgets;
