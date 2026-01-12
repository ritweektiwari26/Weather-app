
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { searchCity } from '../services/weatherService';
import { GeocodingResult } from '../types';

interface SearchBarProps {
  onSelectCity: (city: GeocodingResult) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelectCity }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        setLoading(true);
        const cities = await searchCity(query);
        setResults(cities);
        setIsOpen(true);
        setLoading(false);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-md mx-auto z-50" ref={containerRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-md"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 2 && setIsOpen(true)}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
          >
            <X className="h-4 w-4 text-slate-400 hover:text-white transition-colors" />
          </button>
        )}
      </div>

      {isOpen && (results.length > 0 || loading) && (
        <div className="absolute w-full mt-2 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {loading ? (
            <div className="p-4 text-center text-slate-400 text-sm">Searching...</div>
          ) : (
            <ul className="divide-y divide-slate-800">
              {results.map((result, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => {
                      onSelectCity(result);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-slate-800 flex items-center gap-3 transition-colors group"
                  >
                    <MapPin className="h-4 w-4 text-slate-500 group-hover:text-blue-400" />
                    <div>
                      <div className="text-white font-medium">{result.name}</div>
                      <div className="text-slate-500 text-xs">
                        {result.admin1 ? `${result.admin1}, ` : ''}{result.country}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
