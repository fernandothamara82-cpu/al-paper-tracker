
import React, { useState, useEffect, useMemo } from 'react';
import { DayEntry, TodoItem, StudyGoal } from './types';
import DailyForm from './components/DailyForm';
import Analytics from './components/Analytics';
import TodoList from './components/TodoList';
import StudyTimer from './components/StudyTimer';
import GoalsManager from './components/GoalsManager';
import { getStudyAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState<'log' | 'charts' | 'goals'>('log');
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedEntries = localStorage.getItem('al_paper_entries');
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    
    const savedTodos = localStorage.getItem('al_paper_todos');
    if (savedTodos) setTodos(JSON.parse(savedTodos));

    const savedGoals = localStorage.getItem('al_paper_goals');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('al_paper_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('al_paper_todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('al_paper_goals', JSON.stringify(goals));
  }, [goals]);

  // Fetch AI advice
  useEffect(() => {
    const fetchAdvice = async () => {
      if (entries.length > 0) {
        setLoadingAdvice(true);
        const text = await getStudyAdvice(entries);
        setAdvice(text);
        setLoadingAdvice(false);
      }
    };
    fetchAdvice();
  }, [entries.length]);

  const currentEntry = useMemo(() => 
    entries.find(e => e.date === selectedDate),
  [entries, selectedDate]);

  const handleSaveEntry = (newEntry: DayEntry) => {
    setEntries(prev => {
      const index = prev.findIndex(e => e.date === newEntry.date);
      if (index > -1) {
        const updated = [...prev];
        updated[index] = newEntry;
        return updated;
      }
      return [...prev, newEntry].sort((a, b) => a.date.localeCompare(b.date));
    });
  };

  const handleAddGoal = (goal: StudyGoal) => setGoals(prev => [...prev, goal]);
  const handleDeleteGoal = (id: string) => setGoals(prev => prev.filter(g => g.id !== id));

  const handleAddTodo = (text: string) => {
    const newTodo: TodoItem = { id: Date.now().toString(), text, completed: false };
    setTodos(prev => [newTodo, ...prev]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTodo = (id: string) => setTodos(prev => prev.filter(t => t.id !== id));
  const handleClearCompleted = () => setTodos(prev => prev.filter(t => !t.completed));

  return (
    <div className="min-h-screen pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-200">
              <i className="fa-solid fa-graduation-cap text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">AL Paper Tracker</h1>
              <p className="text-xs text-slate-500 font-medium">Maths Stream Specialist</p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('log')}
              className={`px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'log' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Daily Log
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'charts' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'goals' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Goals
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {activeTab === 'log' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-800">Select Date</h3>
                  <p className="text-sm text-slate-500">Log your progress for a specific day</p>
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-900"
                />
              </div>
              <DailyForm selectedDate={selectedDate} initialData={currentEntry} onSave={handleSaveEntry} />
            </div>
          )}
          {activeTab === 'charts' && <Analytics entries={entries} />}
          {activeTab === 'goals' && <GoalsManager entries={entries} goals={goals} onAddGoal={handleAddGoal} onDeleteGoal={handleDeleteGoal} />}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <StudyTimer />

          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <h3 className="font-bold">AI Mentor</h3>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
              {loadingAdvice ? (
                <div className="flex items-center gap-3 text-white/80 animate-pulse">
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <span className="text-sm">Generating insights...</span>
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-indigo-50">
                  {advice || "Log more data for personal AI insights!"}
                </p>
              )}
            </div>
          </div>

          <TodoList todos={todos} onAdd={handleAddTodo} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} onClearCompleted={handleClearCompleted} />

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Milestones</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Days Active</span>
                <span className="font-bold text-slate-700">{entries.length}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (entries.length / 30) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
