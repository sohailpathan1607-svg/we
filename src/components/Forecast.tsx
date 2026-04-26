import React from 'react';
import { format } from 'date-fns';
import { DailyForecast } from '../services/weatherService';
import { WeatherIcon } from './WeatherIcon';

interface ForecastProps {
  forecasts: DailyForecast[];
}

export const Forecast: React.FC<ForecastProps> = ({ forecasts }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h3 className="text-xl font-bold text-white mb-4 px-4">7-Day Forecast</h3>
      <div className="flex overflow-x-auto pb-4 gap-4 px-4 no-scrollbar">
        {forecasts.map((day, index) => (
          <div 
            key={day.date}
            className={`flex-shrink-0 flex flex-col items-center p-5 rounded-3xl border border-white/20 backdrop-blur-md transition-all hover:scale-105 ${
              index === 0 ? 'bg-white/20' : 'bg-white/5'
            }`}
          >
            <span className="text-sm font-medium text-white/80">
              {index === 0 ? 'Today' : format(new Date(day.date), 'EEE')}
            </span>
            <div className="my-4">
              <WeatherIcon code={day.weatherCode} className="w-10 h-10 text-white" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white">{Math.round(day.maxTemp)}°</span>
              <span className="text-sm font-medium text-white/50">{Math.round(day.minTemp)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
