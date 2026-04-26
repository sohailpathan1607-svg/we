import React from 'react';
import { Wind, Droplets, Thermometer } from 'lucide-react';
import { WeatherData, getWeatherDescription } from '../services/weatherService';
import { WeatherIcon } from './WeatherIcon';
import { format } from 'date-fns';

interface CurrentWeatherProps {
  data: WeatherData;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  const { current, location } = data;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-[2.5rem] shadow-2xl text-white">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            {location.name}
          </h2>
          <p className="text-lg text-white/70 mb-6">
            {format(new Date(), 'EEEE, d MMMM')}
          </p>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <WeatherIcon code={current.weatherCode} className="w-20 h-20 text-white" />
            <div className="text-7xl md:text-8xl font-black">
              {Math.round(current.temperature)}°
            </div>
          </div>
          <p className="text-2xl font-medium mt-4 text-white/90">
            {getWeatherDescription(current.weatherCode)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full md:w-auto">
          <WeatherStat 
            icon={<Thermometer className="text-orange-400" />} 
            label="Feels Like" 
            value={`${Math.round(current.temperature)}°`} 
          />
          <WeatherStat 
            icon={<Droplets className="text-blue-400" />} 
            label="Humidity" 
            value={`${current.humidity}%`} 
          />
          <WeatherStat 
            icon={<Wind className="text-emerald-400" />} 
            label="Wind Speed" 
            value={`${current.windSpeed} km/h`} 
          />
        </div>
      </div>
    </div>
  );
};

interface WeatherStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const WeatherStat: React.FC<WeatherStatProps> = ({ icon, label, value }) => (
  <div className="flex flex-col items-center p-4 bg-white/5 rounded-3xl border border-white/10 min-w-[120px]">
    <div className="mb-2 p-2 bg-white/10 rounded-full">{icon}</div>
    <span className="text-xs text-white/60 font-medium uppercase tracking-wider">{label}</span>
    <span className="text-xl font-bold">{value}</span>
  </div>
);
