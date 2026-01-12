
import React from 'react';
import { 
  Sun, Cloud, CloudRain, CloudLightning, 
  CloudSnow, CloudFog, CloudDrizzle, LucideIcon 
} from 'lucide-react';

export const WEATHER_INTERPRETATION: Record<number, { label: string; icon: LucideIcon }> = {
  0: { label: 'Clear Sky', icon: Sun },
  1: { label: 'Mainly Clear', icon: Sun },
  2: { label: 'Partly Cloudy', icon: Cloud },
  3: { label: 'Overcast', icon: Cloud },
  45: { label: 'Foggy', icon: CloudFog },
  48: { label: 'Depositing Rime Fog', icon: CloudFog },
  51: { label: 'Light Drizzle', icon: CloudDrizzle },
  53: { label: 'Moderate Drizzle', icon: CloudDrizzle },
  55: { label: 'Dense Drizzle', icon: CloudDrizzle },
  61: { label: 'Slight Rain', icon: CloudRain },
  63: { label: 'Moderate Rain', icon: CloudRain },
  65: { label: 'Heavy Rain', icon: CloudRain },
  71: { label: 'Slight Snow', icon: CloudSnow },
  73: { label: 'Moderate Snow', icon: CloudSnow },
  75: { label: 'Heavy Snow', icon: CloudSnow },
  80: { label: 'Slight Rain Showers', icon: CloudRain },
  81: { label: 'Moderate Rain Showers', icon: CloudRain },
  82: { label: 'Violent Rain Showers', icon: CloudRain },
  95: { label: 'Thunderstorm', icon: CloudLightning },
  96: { label: 'Thunderstorm with Hail', icon: CloudLightning },
  99: { label: 'Severe Thunderstorm with Hail', icon: CloudLightning },
};

export const DEFAULT_CITY = 'New York';
