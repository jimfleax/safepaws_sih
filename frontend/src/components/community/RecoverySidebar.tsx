import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Eye, MapPin, Heart, CheckCircle2, Clock } from 'lucide-react';

export function RecoverySidebar({ activeAlerts }: { activeAlerts: any[] }) {
  // Mock recovery tasks based on active alerts
  const tasks = activeAlerts.slice(0, 3).map(a => ({
    id: a.id,
    title: `Distribute flyers for ${a.petName}`,
    status: Math.random() > 0.5 ? 'pending' : 'in-progress'
  }));
  
  tasks.push({
    id: 't1',
    title: 'Check Connaught Place shelter',
    status: 'completed'
  });

  return (
    <div className="flex-col h-full bg-[var(--color-surface)] border-l border-[var(--color-border)] w-80 flex-shrink-0 hidden lg:flex py-4">
      <div className="px-5 mb-6">
        <h2 className="text-lg font-black text-[var(--color-ink)] mb-1">Recovery Hub</h2>
        <p className="text-xs text-[var(--color-ink-soft)]">Active community efforts</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 space-y-8">
        
        {/* Quick Actions */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-3">Quick Actions</h3>
          <div className="grid gap-2">
            <Link to="/lost/new" className="flex items-center gap-3 p-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors shadow-sm group">
              <AlertTriangle size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold">Report Lost Pet</span>
            </Link>
            <Link to="/sightings/new" className="flex items-center gap-3 p-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink)] rounded-xl hover:bg-[var(--color-background)] transition-colors shadow-sm group">
              <Eye size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Log a Sighting</span>
            </Link>
          </div>
        </div>

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-3 flex items-center justify-between">
              Active Alerts 
              <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px]">{activeAlerts.length}</span>
            </h3>
            <div className="space-y-3">
              {activeAlerts.slice(0, 4).map(a => (
                <Link key={a.id} to={`/alerts/${a.id}`} className="flex gap-3 p-3 rounded-xl border border-[var(--color-border)] hover:border-amber-300 hover:bg-amber-50/50 transition-colors group bg-[var(--color-background)]">
                  <div className="w-12 h-12 rounded-lg bg-[var(--color-surface)] overflow-hidden border border-[var(--color-border)] flex-shrink-0 relative">
                    {a.photoUrl ? (
                      <img src={a.photoUrl} alt={a.petName} className="w-full h-full object-cover" />
                    ) : (
                      <Heart size={16} className="m-auto mt-3.5 text-[var(--color-ink-soft)]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-sm font-bold text-[var(--color-ink)] truncate group-hover:text-amber-700 transition-colors">{a.petName}</p>
                    <p className="text-xs text-[var(--color-ink-soft)] truncate flex items-center gap-1 mt-0.5">
                      <MapPin size={10} className="flex-shrink-0" /> {a.lastSeenAddress}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Community Recovery Tasks */}
        <div>
           <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-3">Recovery Tasks</h3>
           <div className="space-y-2">
             {tasks.map(task => (
               <div key={task.id} className="flex items-start gap-2 p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]">
                 <div className="mt-0.5">
                   {task.status === 'completed' && <CheckCircle2 size={16} className="text-emerald-500" />}
                   {task.status === 'in-progress' && <Clock size={16} className="text-blue-500" />}
                   {task.status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                 </div>
                 <div className="flex-1">
                   <p className={`text-sm ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-[var(--color-ink)] font-medium'}`}>
                     {task.title}
                   </p>
                   <p className="text-[10px] text-[var(--color-ink-soft)] uppercase mt-1 tracking-wider font-bold">
                     {task.status.replace('-', ' ')}
                   </p>
                 </div>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
}
