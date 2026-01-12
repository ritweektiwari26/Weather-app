
import React from 'react';
import { 
  AreaChart, Area, XValues, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, XAxis 
} from 'recharts';

interface ForecastChartProps {
  data: Array<{ time: string; temp: number }>;
}

const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    time: new Date(item.time).getHours() + ':00',
    temp: Math.round(item.temp)
  }));

  return (
    <div className="h-48 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            interval={3}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '12px',
              color: '#fff' 
            }}
            itemStyle={{ color: '#3b82f6' }}
            cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
          />
          <Area 
            type="monotone" 
            dataKey="temp" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorTemp)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
