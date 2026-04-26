import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, Navigation } from 'lucide-react';
import { searchLocations, LocationData } from '../services/weatherService';

interface SearchBarProps {
  onLocationSelect: (location: LocationData) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect }) => {
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationSelect({
            name: 'Current Location',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your location. Please check permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setLoading(true);
        try {
          const data = await searchLocations(query);
          setResults(data);
          setShowDropdown(true);
        } catch (error) {
          console.error('Error searching locations:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (location: LocationData) => {
    onLocationSelect(location);
    setQuery('');
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-3 pl-12 pr-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" size={20} />
        <button 
          onClick={handleCurrentLocation}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white/70 hover:text-white"
          title="Use my location"
        >
          <Navigation size={20} />
        </button>
        {loading && <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 text-white/70 animate-spin" size={20} />}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {results.map((location, index) => (
            <button
              key={`${location.latitude}-${location.longitude}-${index}`}
              className="w-full px-4 py-3 text-left hover:bg-blue-500/10 flex items-center gap-3 transition-colors border-b border-gray-100 last:border-0"
              onClick={() => handleSelect(location)}
            >
              <MapPin size={18} className="text-blue-500" />
              <div>
                <div className="font-semibold text-gray-800">{location.name}</div>
                <div className="text-xs text-gray-500">
                  {location.admin1 ? `${location.admin1}, ` : ''}{location.country}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
