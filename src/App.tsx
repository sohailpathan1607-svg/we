import { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { Download, Globe } from 'lucide-react';
import { APP_CONFIG } from './config';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
import { CurrentWeather } from './components/CurrentWeather';
import { Forecast } from './components/Forecast';
import { getWeatherData, WeatherData, LocationData } from './services/weatherService';
import { Cloud, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const fetchWeather = async (location: LocationData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherData(location);
      setWeather(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Default location (London)
    const defaultLocation: LocationData = {
      name: 'London',
      latitude: 51.5074,
      longitude: -0.1278,
      country: 'United Kingdom'
    };
    fetchWeather(defaultLocation);
  }, []);

  const getBackgroundClass = () => {
    if (!weather) return 'from-blue-500 to-indigo-700';
    const code = weather.current.weatherCode;
    
    // WMO Weather interpretation codes
    if (code === 0) return 'from-amber-400 to-orange-500'; // Clear
    if (code >= 1 && code <= 3) return 'from-blue-400 to-indigo-500'; // Partly cloudy
    if (code >= 45 && code <= 48) return 'from-gray-400 to-gray-600'; // Fog
    if (code >= 51 && code <= 67) return 'from-blue-700 to-slate-800'; // Rain/Drizzle
    if (code >= 71 && code <= 86) return 'from-slate-200 to-blue-300'; // Snow
    if (code >= 95) return 'from-purple-800 to-slate-950'; // Thunder
    return 'from-blue-500 to-indigo-700';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br transition-all duration-1000 ${getBackgroundClass()} flex flex-col items-center py-10 px-4 font-sans`}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl flex flex-col items-center gap-8"
      >
        <div className="flex items-center justify-between w-full max-w-md mb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Cloud className="text-white w-10 h-10" />
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">{APP_CONFIG.shortName}</h1>
            </div>
            <div className="flex items-center gap-1 mt-1 text-white/60">
              <Globe size={12} />
              <span className="text-[10px] font-bold tracking-widest uppercase">{APP_CONFIG.domain}</span>
            </div>
          </div>
          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-xl text-white text-sm font-bold transition-all animate-bounce"
            >
              <Download size={18} />
              Install
            </button>
          )}
        </div>

        <SearchBar onLocationSelect={fetchWeather} />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-white"
            >
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="text-xl font-medium text-white">Fetching the clouds...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/20 backdrop-blur-md border border-red-500/30 p-6 rounded-3xl flex items-center gap-4 text-white max-w-md"
            >
              <AlertCircle size={24} />
              <p>{error}</p>
            </motion.div>
          ) : weather ? (
            <motion.div 
              key="content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <CurrentWeather data={weather} />
              <Forecast forecasts={weather.daily} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <footer className="mt-auto pt-20 text-white/40 text-sm font-medium flex flex-col items-center gap-1">
          <p>Powered by Open-Meteo • {APP_CONFIG.domain}</p>
          <p className="text-[10px] opacity-50 uppercase tracking-[0.2em]">© 2024 SkyCast Weather Forecast</p>
        </footer>
      </motion.div>
    </div>
  );
}
