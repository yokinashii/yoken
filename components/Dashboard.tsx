
import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Legend
} from 'recharts';
import { Bot } from 'lucide-react';
import { MetricLog } from '../types';

interface DashboardProps {
  logs: MetricLog[];
}

const ImageWithFallback: React.FC<{ src: string; alt: string; fallback: React.ReactNode; className?: string }> = ({ src, alt, fallback, className }) => {
  const [error, setError] = useState(false);
  if (error) return <div className={className + " flex items-center justify-center bg-purple-900/10"}>{fallback}</div>;
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};

const Dashboard: React.FC<DashboardProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 glass rounded-3xl p-8 text-center border-dashed border-2 border-white/5">
        <div className="w-32 h-32 mb-4 relative">
          <ImageWithFallback
            src="/assets/ketus/ketus-thinking.png"
            alt="Thinking Ketuś"
            fallback={<Bot size={48} className="text-purple-500/20" />}
            className="w-full h-full object-contain opacity-30"
          />
        </div>
        <p className="text-gray-500 font-medium">Analiza trendów wymaga danych.</p>
        <p className="text-sm text-gray-600 mt-2">Ketuś czeka na Twój pierwszy raport w czacie!</p>
      </div>
    );
  }

  const chartData = logs.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Weight Trend */}
        <div className="glass rounded-3xl p-6 h-80 relative overflow-hidden border border-purple-500/10 shadow-lg">
          <div className="absolute top-4 right-4 w-12 h-12 opacity-10 pointer-events-none group-hover:opacity-30 transition-opacity">
            <ImageWithFallback src="/assets/ketus/ketus-confident.png" alt="Weight Mascot" fallback={<Bot />} className="w-full h-full object-contain" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            Biometryczna Waga (kg)
          </h3>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a0b2e', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '16px', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }}
                labelStyle={{ color: '#8b5cf6', fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Area type="monotone" dataKey="weight" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorWeight)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Well-being & Sleep */}
        <div className="glass rounded-3xl p-6 h-80 relative overflow-hidden border border-blue-500/10 shadow-lg">
          <div className="absolute top-4 right-4 w-12 h-12 opacity-10 pointer-events-none">
            <ImageWithFallback src="/assets/ketus/ketus-smiling.png" alt="Sleep Mascot" fallback={<Bot />} className="w-full h-full object-contain" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-4 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-blue-500"></span>
             Hormony & Sen (1-10)
          </h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="date" hide />
              <YAxis domain={[0, 10]} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a0b2e', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', fontSize: '12px' }}
              />
              <Legend iconType="circle" />
              <Line type="monotone" dataKey="wellBeing" stroke="#3b82f6" name="Energia" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
              <Line type="monotone" dataKey="sleepQuality" stroke="#10b981" name="Sen" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Motivational Mascot Strip */}
      {logs.length > 0 && (
        <div className="glass rounded-3xl p-4 flex items-center gap-6 border-l-4 border-purple-500 shadow-xl bg-purple-900/10">
           <div className="w-20 h-20 flex-shrink-0 relative">
             <div className="absolute inset-0 bg-purple-500/10 blur-xl rounded-full"></div>
             <ImageWithFallback src="/assets/ketus/ketus-excited.png" alt="Happy Ketuś" fallback={<Bot size={32} className="text-purple-400" />} className="w-full h-full object-contain relative z-10" />
           </div>
           <div>
             <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">Analiza Strategiczna:</p>
             <p className="text-sm text-gray-100 font-medium leading-relaxed">"{logs[logs.length-1].progressNote}"</p>
             <p className="text-[10px] text-gray-500 mt-2 italic">Ketogenic Bio-feedback Engine v1.0</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
