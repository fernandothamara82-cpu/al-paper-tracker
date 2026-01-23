
import React, { useState } from 'react';
import { TodoItem } from '../types';

interface TodoListProps {
  todos: TodoItem[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClearCompleted: () => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onAdd, onToggle, onDelete, onClearCompleted }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <i className="fa-solid fa-list-check text-indigo-500"></i>
          Study Tasks
        </h3>
        {completedCount > 0 && (
          <button 
            onClick={onClearCompleted}
            className="text-[10px] uppercase font-bold text-slate-400 hover:text-red-500 transition-colors"
          >
            Clear Completed
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What's next for today?"
            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-700 placeholder:text-slate-400"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-indigo-700 p-1"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </form>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {todos.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-slate-400 italic">No tasks yet. Add one above!</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div 
              key={todo.id}
              className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${
                todo.completed 
                ? 'bg-slate-50 border-slate-100 opacity-60' 
                : 'bg-white border-slate-200 hover:border-indigo-200'
              }`}
            >
              <button 
                onClick={() => onToggle(todo.id)}
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  todo.completed 
                  ? 'bg-indigo-500 border-indigo-500 text-white' 
                  : 'border-slate-300 bg-white group-hover:border-indigo-400'
                }`}
              >
                {todo.completed && <i className="fa-solid fa-check text-[10px]"></i>}
              </button>
              <span 
                onClick={() => onToggle(todo.id)}
                className={`flex-1 text-sm cursor-pointer select-none ${
                  todo.completed ? 'line-through text-slate-500' : 'text-slate-700 font-medium'
                }`}
              >
                {todo.text}
              </span>
              <button 
                onClick={() => onDelete(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1"
              >
                <i className="fa-solid fa-trash-can text-xs"></i>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
