
import React, { useState, useEffect } from 'react';
import { Heart, Activity, Moon, TrendingDown, ClipboardList, Settings, Info, Bot, LogOut, Crown } from 'lucide-react';
import ChatWindow from './components/ChatWindow';
import Dashboard from './components/Dashboard';
import { Auth } from './components/Auth';
import { MetricLog, Message } from './types';
import { chatWithKetus } from './services/geminiService';
import { supabase, fetchLogs, saveLog, getProfile } from './services/supabaseService';

const ImageWithFallback: React.FC<{ src: string; alt: string; fallback: React.ReactNode; className?: string }> = ({ src, alt, fallback, className }) => {
  const [error, setError] = useState(false);
  if (error) return <div className={className + " flex items-center justify-center bg-purple-900/20"}>{fallback}</div>;
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<MetricLog[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      loadUserData();
    } else {
      setLogs([]);
      setProfile(null);
      setIsDataLoading(false);
    }
  }, [session]);

  async function loadUserData() {
    setIsDataLoading(true);
    try {
      const [userLogs, userProfile] = await Promise.all([
        fetchLogs(),
        getProfile()
      ]);
      setLogs(userLogs.map((l: any) => ({
        id: l.id,
        date: l.date,
        weight: l.weight,
        wellBeing: l.well_being,
        sleepQuality: l.sleep_quality,
        progressNote: l.progress_note
      })));
      setProfile(userProfile);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setIsDataLoading(false);
    }
  }

  const handleSendMessage = async (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
        parts: [{ text: m.content }]
      }));

      const response = await chatWithKetus(content, history, async (metrics) => {
        const newLogData = {
          date: new Date().toISOString().split('T')[0],
          weight: metrics.weight || 0,
          wellBeing: metrics.wellBeing || 5,
          sleepQuality: metrics.sleepQuality || 5,
          progressNote: metrics.progressNote || "Brak notatki",
        };
        
        try {
          const saved = await saveLog(newLogData);
          setLogs(prev => [...prev, {
            id: saved.id,
            date: saved.date,
            weight: saved.weight,
            wellBeing: saved.well_being,
            sleepQuality: saved.sleep_quality,
            progressNote: saved.progress_note
          }]);
        } catch (e) {
          console.error("Failed to save to Supabase:", e);
        }
      });

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Słuchaj, coś mi się w biochemii pomieszało. Powtórz to, proszę.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) return <Auth />;
  if (isDataLoading) return (
    <div className="min-h-screen bg-[#0f041a] flex flex-col items-center justify-center text-purple-400 gap-4">
      <div className="w-20 h-20 animate-bounce">
         <ImageWithFallback src="/assets/ketus/ketus-waving.png" alt="Loading Ketuś" fallback={<Bot size={64}/>} />
      </div>
      <p className="animate-pulse font-bold uppercase tracking-widest text-xs">Kalibrowanie Ketusia...</p>
    </div>
  );

  const latestLog = logs[logs.length - 1];
  const weightDiff = logs.length > 1 ? logs[logs.length - 1].weight - logs[logs.length - 2].weight : 0;

  return (
    <div className="min-h-screen bg-[#0f041a] text-white selection:bg-purple-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-purple-500/30 bg-purple-900/50 shadow-lg shadow-purple-500/20 flex-shrink-0 hover:scale-110 transition-transform">
            <ImageWithFallback
              src="/assets/ketus/ketus-waving.png"
              alt="Ketuś Logo"
              fallback={<Bot className="text-purple-400" size={24} />}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Ketuś</h1>
            <div className="flex items-center gap-2">
              <p className="text-[10px] uppercase tracking-widest text-purple-400 font-semibold">{profile?.first_name} {profile?.last_name}</p>
              {profile?.is_premium && <Crown size={12} className="text-yellow-400 fill-yellow-400" />}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={handleLogout} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400" title="Wyloguj">
              <LogOut size={20} />
           </button>
           <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400">
              <Settings size={20} />
           </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto pt-28 pb-12 px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Dashboard & Stats */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass rounded-3xl p-6 flex items-center gap-4 group hover:bg-white/10 transition-all border border-purple-500/10 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform overflow-hidden p-1">
                <ImageWithFallback src="/assets/ketus/ketus-confident.png" alt="Weight Ketuś" fallback={<TrendingDown size={24}/>} className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Waga</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{latestLog?.weight || '--'} kg</p>
                  {weightDiff !== 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${weightDiff < 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {weightDiff > 0 ? '+' : ''}{weightDiff.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6 flex items-center gap-4 group hover:bg-white/10 transition-all border border-blue-500/10 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform overflow-hidden p-1">
                <ImageWithFallback src="/assets/ketus/ketus-excited.png" alt="Energy Ketuś" fallback={<Heart size={24}/>} className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Energia</p>
                <p className="text-2xl font-bold">{latestLog?.wellBeing || '--'}/10</p>
              </div>
            </div>

            <div className="glass rounded-3xl p-6 flex items-center gap-4 group hover:bg-white/10 transition-all border border-teal-500/10 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform overflow-hidden p-1">
                <ImageWithFallback src="/assets/ketus/ketus-smiling.png" alt="Sleep Ketuś" fallback={<Moon size={24}/>} className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Sen</p>
                <p className="text-2xl font-bold">{latestLog?.sleepQuality || '--'}/10</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Panel Analityczny</h2>
            <Dashboard logs={logs} />
          </div>

          {/* History */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ClipboardList className="text-purple-400" />
              Ostatnie Logi
            </h2>
            <div className="glass rounded-3xl overflow-hidden border border-white/5">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Waga</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logs.length > 0 ? (
                    logs.slice().reverse().map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors text-sm">
                        <td className="px-6 py-4 font-medium text-purple-300">{log.date}</td>
                        <td className="px-6 py-4 font-bold">{log.weight} kg</td>
                        <td className="px-6 py-4 italic text-gray-400 text-xs">{log.progressNote}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-gray-600 italic">
                        Brak zapisanych logów. Napisz do Ketusia!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Chat */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
          <ChatWindow 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
          />
        </div>
        
      </main>

      {/* Floating Action Hint */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-full flex items-center gap-3 text-xs border border-purple-500/30 shadow-2xl z-40">
        <div className="w-6 h-6 rounded-full overflow-hidden border border-purple-500/50 bg-purple-900">
           <ImageWithFallback src="/assets/ketus/ketus-confident.png" alt="Ketuś Badge" fallback={<Bot size={12}/>} className="w-full h-full object-cover" />
        </div>
        <span className="text-purple-400 font-bold uppercase tracking-tighter">Status:</span>
        <span className="text-gray-300 font-medium">Dane zsynchronizowane z chmurą Supabase.</span>
      </div>
    </div>
  );
};

export default App;
