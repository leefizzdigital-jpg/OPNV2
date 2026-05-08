import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Layers, 
  BarChart3, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  ShieldCheck,
  Disc
} from 'lucide-react';
import { OpalRecord } from '../types';
import { formatCur, PORTAL_CHART_DATA } from '../data';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface TheLevelProps {
  data: OpalRecord[];
}

export function TheLevel({ data }: TheLevelProps) {
  const [livePulse, setLivePulse] = React.useState(0);
  
  const [viewedStat, setViewedStat] = React.useState<'physical' | 'digital' | null>(null);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLivePulse(p => p + (Math.random() - 0.5) * 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nfts = data.filter(r => r.nft);
  const physicals = data.filter(r => !r.nft);

  const baseTotal = data.reduce((acc, r) => acc + (r.nft_value || r.mk_rough_total || 0), 0);
  const totalValue = baseTotal + livePulse;
  
  const nftValue = nfts.reduce((acc, r) => acc + (r.nft_value || 0), 0);
  const physicalValue = physicals.reduce((acc, r) => acc + (r.mk_rough_total || 0), 0);
  
  const avgGrade = (data.reduce((acc, r) => acc + (r.mk_grade || 1), 0) / (data.length || 1)).toFixed(1);

  // Grade distribution matrix - ensuring it's not empty
  const distribution = Array.from({ length: 9 }, (_, i) => {
    const grade = i + 1;
    const count = data.filter(r => r.mk_grade === grade).length;
    return {
      grade: `M${grade}`,
      count: count
    };
  });

  return (
    <div className="space-y-8 animate-[opn-fadein_0.5s]">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="PORTFOLIO VALUE" 
          value={formatCur(totalValue)} 
          change="+14.2% VS MKT" 
          icon={<TrendingUp size={18} className="text-[#00D1FF]" />}
          gradient="from-[#00D1FF]/10 to-transparent"
        />
        <div 
          className="cursor-pointer"
          onClick={() => window.dispatchEvent(new CustomEvent('change-view', { detail: 'parcel-physical' }))}
        >
          <StatCard 
            label="PHYSICAL HOLDINGS" 
            value={formatCur(physicalValue)} 
            change={`${physicals.length} ASSETS`} 
            icon={<Layers size={18} className="text-white/60" />}
            gradient="from-white/5 to-transparent"
          />
        </div>
        <div 
          className="cursor-pointer"
          onClick={() => window.dispatchEvent(new CustomEvent('change-view', { detail: 'parcel-digital' }))}
        >
          <StatCard 
            label="DIGITAL ASSETS" 
            value={formatCur(nftValue)} 
            change={`${nfts.length} TWINS`} 
            icon={<Zap size={18} className="text-[#00D1FF]" />}
            gradient="from-[#00D1FF]/10 to-transparent"
          />
        </div>
        <StatCard 
          label="PORTFOLIO GRADE" 
          value={`M${avgGrade}`} 
          change="TIER 1 STATUS" 
          icon={<Activity size={18} className="text-[#00D1FF]" />}
          gradient="from-[#00D1FF]/10 to-transparent"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Market Signal */}
        <div className="lg:col-span-2 glass-panel rounded-[32px] p-8 md:p-12 border-white/5 relative overflow-hidden h-[450px]">
          <div className="flex justify-between items-center mb-12">
             <div className="space-y-1">
                <h3 className="text-[9px] font-bold text-white/90 uppercase tracking-[0.4em]">MARKET SIGNAL / ASSET VELOCITY</h3>
                <p className="text-[8px] text-white/30 uppercase tracking-[0.3em] font-medium font-mono">OPN NODE ID: 0xF2A9 • LIVE PROTOCOL</p>
             </div>
             <div className="flex gap-6">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] shadow-[0_0_8px_rgba(0,209,255,0.8)]"></div>
                   <span className="text-[9px] text-white/50 font-bold uppercase tracking-widest">DIGITAL TWINS</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                   <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest">PHYSICAL BASE</span>
                </div>
             </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PORTAL_CHART_DATA}>
                <defs>
                  <linearGradient id="colorDigital" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D1FF" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#02050a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPhysical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                   dataKey="month" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{fill: 'rgba(255,255,255,0.15)', fontSize: 8, fontWeight: 'medium', letterSpacing: '0.2em'}} 
                   dy={15}
                />
                <YAxis hide={true} />
                <Tooltip 
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                  contentStyle={{ backgroundColor: '#02050a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px' }}
                  itemStyle={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.1em' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00D1FF" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorDigital)" 
                  name="Digital Twin"
                />
                <Area 
                  type="monotone" 
                  dataKey={(v:any) => v.value * 0.7 + (Math.random()*1000)} 
                  stroke="rgba(255,255,255,0.1)" 
                  strokeWidth={1}
                  fillOpacity={1} 
                  fill="url(#colorPhysical)" 
                  name="Real Asset"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="glass-panel rounded-[32px] p-8 md:p-12 border-white/5 relative overflow-hidden h-[450px]">
          <h3 className="text-[9px] font-bold text-white/90 uppercase tracking-[0.4em] mb-12 text-center">GRADE DENSITY MATRIX</h3>
          
          <div className="flex items-end justify-between h-[250px] gap-3 px-2">
             {distribution.map((d, i) => {
               const height = d.count > 0 ? (d.count / Math.max(...distribution.map(x => x.count))) * 100 : 5;
               return (
                 <div key={d.grade} className="flex-1 flex flex-col items-center gap-4">
                    <div className="w-full relative group h-full flex flex-col justify-end">
                       <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
                          className={`w-full rounded-full transition-all duration-700 ${d.count > 0 ? 'bg-[#00D1FF] shadow-[0_0_15px_rgba(0,209,255,0.3)]' : 'bg-white/5'}`}
                       />
                       {d.count > 0 && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[8px] font-black text-[#00D1FF] font-mono">
                             {d.count}
                          </div>
                       )}
                    </div>
                    <span className="text-[8px] font-bold text-white/20 tracking-[0.2em] font-mono uppercase">{d.grade}</span>
                 </div>
               );
             })}
          </div>
        </div>
      </div>

      {/* Bottom Inventory Mini Section */}
      <div className="glass-panel rounded-[40px] p-12 border-white/5 bg-white/[0.01]">
        <div className="flex justify-between items-end mb-16 pb-6 border-b border-white/5">
          <div className="space-y-1">
            <h3 className="text-[9px] font-bold text-white/30 uppercase tracking-[0.5em] font-mono">ASSET INVENTORY SNAPSHOT</h3>
            <p className="text-[8px] text-white/10 uppercase tracking-[0.4em] font-medium font-mono">OPN_PROTOCOL_VER: 3.11.2</p>
          </div>
          <span className="text-[10px] text-[#00D1FF] font-bold uppercase tracking-[0.4em] font-mono">{data.length} NODES_SYNCED</span>
        </div>
        
        <div className="space-y-6">
           {data.slice(0, 6).map((r, i) => (
             <div key={r.id} className="flex items-center justify-between py-6 border-b border-white/[0.03] hover:bg-white/[0.02] transition-all px-4 rounded-xl group cursor-pointer">
                <div className="flex items-center gap-10">
                   <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/5 bg-black p-1 shrink-0">
                      <img src={r.img} alt="" className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out" />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-sm font-display font-light text-white uppercase tracking-[0.15em]">{r.name}</h4>
                      <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-mono">0x{r.id.toString().slice(0,6).toUpperCase()} • {r.ct}CT • {r.pattern}</p>
                   </div>
                </div>
                
                <div className="flex items-center gap-16">
                   <div className="hidden md:block text-right">
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em] mb-2 font-mono">GRADE</p>
                      <div className="text-[11px] font-bold text-white font-mono tracking-widest">M{r.mk_grade}</div>
                   </div>
                   <div className="text-right min-w-[120px]">
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em] mb-2 font-mono">MINER_VAL</p>
                      <p className="text-sm font-display font-light text-white tracking-widest uppercase">{formatCur(r.mk_rough_total)}</p>
                   </div>
                   <div className="text-right min-w-[120px]">
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em] mb-2 font-mono">VARIANCE</p>
                      <div className="flex items-center justify-end gap-2">
                        <div className={`w-1 h-1 rounded-full ${r.div_pct_val && r.div_pct_val > 0 ? 'bg-[#00D1FF] animate-pulse' : 'bg-white/10'}`} />
                        <p className={`text-sm font-display font-light ${r.div_pct_val && r.div_pct_val > 0 ? 'text-[#00D1FF]' : 'text-white/40'}`}>
                           {r.divergence_pct}
                        </p>
                      </div>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, icon, gradient }: { label: string, value: string, change: string, icon: React.ReactNode, gradient: string }) {
  return (
    <div className={`glass-panel rounded-[32px] p-8 border-white/5 relative overflow-hidden group hover:border-[#00D1FF]/20 transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]`}>
      <div className={`absolute -right-12 -top-12 w-40 h-40 blur-[60px] rounded-full bg-gradient-to-br ${gradient} group-hover:scale-150 transition-transform duration-1000 opacity-40`}></div>
      
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/10 group-hover:border-[#00D1FF]/30 transition-colors shadow-inner">
          {icon}
        </div>
        <div className="flex items-center gap-2 text-[8px] font-bold text-white/30 tracking-[0.3em] bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/5 font-mono">
           <div className="w-1 h-1 rounded-full bg-[#00D1FF] animate-pulse" />
           SYNCED
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.4em] mb-3">{label}</p>
        <h4 className="text-3xl font-display font-light text-white tracking-widest mb-6 group-hover:text-[#00D1FF] transition-colors uppercase">
          <motion.span
            key={value}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {value}
          </motion.span>
        </h4>
        <div className="flex items-center gap-2">
           <div className="text-[8px] font-mono font-medium text-[#00D1FF] tracking-widest flex items-center gap-1.5 bg-[#00D1FF]/5 px-3 py-1 rounded-full border border-[#00D1FF]/10 uppercase">
              {change}
           </div>
        </div>
      </div>
    </div>
  );
}
