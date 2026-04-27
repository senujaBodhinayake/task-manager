'use client';
import { useState } from 'react';
import { TaskFormProps, CreateTaskInput } from '@/types';

export default function TaskForm({ initialData, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const [form, setForm] = useState<CreateTaskInput>({
    title:       initialData?.title       || '',
    description: initialData?.description || '',
    status:      initialData?.status      || 'todo',
  });
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) { setError('Title is required'); return; }
    await onSubmit(form);
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <h2 className="text-xl font-bold tracking-tight text-slate-100 mb-6">
          {initialData ? 'Edit Task' : 'New Task'}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-6 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Title <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              maxLength={100}
              className="w-full bg-slate-950/50 border border-white/10 text-slate-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
              placeholder="Enter task title..."
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
            <textarea
              rows={3}
              maxLength={500}
              className="w-full bg-slate-950/50 border border-white/10 text-slate-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none transition-all placeholder:text-slate-600"
              placeholder="Add more details..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
            <select
              className="w-full bg-slate-950/50 border border-white/10 text-slate-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value as CreateTaskInput['status'] })}
            >
              <option value="todo" className="bg-slate-900 text-slate-100">To Do</option>
              <option value="in-progress" className="bg-slate-900 text-slate-100">In Progress</option>
              <option value="done" className="bg-slate-900 text-slate-100">Done</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-white/10 bg-white/5 text-slate-300 font-medium py-2.5 rounded-xl hover:bg-white/10 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg shadow-indigo-500/25"
            >
              {isLoading ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}