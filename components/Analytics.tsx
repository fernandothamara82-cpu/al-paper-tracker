
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { DayEntry } from '../types';

interface AnalyticsProps {
  entries: DayEntry[];
}

const Analytics: React.FC<AnalyticsProps> = ({ entries }) => {
  const chartData = entries.slice(-14).map(entry => {
    const totalPhysics = entry.papers.physics.mcq + entry.papers.physics.essay;
    const totalChemistry = entry.papers.chemistry.mcq + entry.papers.chemistry.essay;
    const totalMaths = entry.papers.maths.pure + entry.papers.maths.applied;

    return {
      name: new Date(entry.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      Physics: totalPhysics,
      Chemistry: totalChemistry,
      Maths: totalMaths,
      total: totalPhysics + totalChemistry + totalMaths
    };
  });

  const totals = entries.reduce((acc, entry) => {
    acc.physics += entry.papers.physics.mcq + entry.papers.physics.essay;
    acc.chemistry += entry.papers.chemistry.mcq + entry.papers.chemistry.essay;
    acc.maths += entry.papers.maths.pure + entry.papers.maths.applied;
    return acc;
  }, { physics: 0, chemistry: 0, maths: 0 });

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-sm font-medium text-slate-500 mb-1">Total Physics Papers</div>
          <div className="text-3xl font-bold text-blue-600">{totals.physics}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-sm font-medium text-slate-500 mb-1">Total Chemistry Papers</div>
          <div className="text-3xl font-bold text-emerald-600">{totals.chemistry}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-sm font-medium text-slate-500 mb-1">Total Maths Papers</div>
          <div className="text-3xl font-bold text-indigo-600">{totals.maths}</div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <i className="fa-solid fa-chart-line text-indigo-500"></i>
          Activity Trend (Last 14 Days)
        </h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPhy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorChem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMath" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
              />
              <Legend verticalAlign="top" height={36}/>
              <Area type="monotone" dataKey="Physics" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPhy)" strokeWidth={3} />
              <Area type="monotone" dataKey="Chemistry" stroke="#10b981" fillOpacity={1} fill="url(#colorChem)" strokeWidth={3} />
              <Area type="monotone" dataKey="Maths" stroke="#6366f1" fillOpacity={1} fill="url(#colorMath)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Bar Chart Comparison */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Subject Breakdown</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
              />
              <Bar dataKey="Physics" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Chemistry" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Maths" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
