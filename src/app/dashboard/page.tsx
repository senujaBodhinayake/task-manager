'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/types';
import Navbar from '@/components/Navbar';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';

export default function DashboardPage() {
  const { accessToken, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [tasks, setTasks]           = useState<Task[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [saving, setSaving]         = useState(false);

 // Fix 1 — redirect effect
  useEffect(() => {
    if (!authLoading && !accessToken) router.push('/login');
  }, [accessToken, authLoading, router]); // ← add router


  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/tasks', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setTasks(data);
    } catch {
      setError('Failed to load tasks. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]); // ← accessToken is the dependency

  useEffect(() => {
    if (accessToken) fetchTasks();
  }, [accessToken, fetchTasks]); // ← add fetchTasks
  async function handleCreate(data: CreateTaskInput | UpdateTaskInput) {
    setSaving(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create');
      const newTask = await res.json();
      setTasks(prev => [newTask, ...prev]);
      setShowForm(false);
    } catch {
      setError('Failed to create task.');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(data: CreateTaskInput | UpdateTaskInput) {
    if (!editingTask) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/tasks/${editingTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
      setEditingTask(null);
    } catch {
      setError('Failed to update task.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this task?')) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch {
      setError('Failed to delete task.');
    }
  }

  // Group tasks by status
  const grouped = {
    'todo':        tasks.filter(t => t.status === 'todo'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    'done':        tasks.filter(t => t.status === 'done'),
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium tracking-wide animate-pulse">Loading workspace...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">My Workspace</h1>
            <p className="text-slate-400 mt-2 text-lg">You have <span className="text-indigo-400 font-semibold">{tasks.length}</span> task{tasks.length !== 1 ? 's' : ''} in total</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-indigo-500 hover:from-indigo-400 to-purple-600 hover:to-purple-500 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            New Task
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-2xl mb-8 flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {error}
            </div>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-300 underline font-medium">Dismiss</button>
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6">
                <div className="h-6 w-32 bg-white/5 rounded-full mb-6 animate-pulse" />
                <div className="space-y-4">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="bg-white/[0.03] rounded-2xl border border-white/[0.05] p-5 h-32 animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Kanban columns */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {(Object.entries(grouped) as [Task['status'], Task[]][]).map(([status, items]) => (
              <div key={status} className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-sm min-h-[500px]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                    {status === 'todo' ? <span className="w-2.5 h-2.5 rounded-full bg-slate-500 shadow-[0_0_8px_rgba(100,116,139,0.8)]"/> : 
                     status === 'in-progress' ? <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"/> : 
                     <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"/>}
                    {status === 'todo' ? 'To Do' : status === 'in-progress' ? 'In Progress' : 'Done'}
                  </h2>
                  <span className="bg-white/10 text-slate-300 text-xs font-bold px-2.5 py-1 rounded-full border border-white/5">{items.length}</span>
                </div>
                
                <div className="space-y-4">
                  {items.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center text-sm font-medium text-slate-500">
                      Drop tasks here
                    </div>
                  ) : (
                    items.map(task => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onEdit={task => setEditingTask(task)}
                        onDelete={handleDelete}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showForm && (
        <TaskForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          isLoading={saving}
        />
      )}
      {editingTask && (
        <TaskForm
          initialData={editingTask}
          onSubmit={handleUpdate}
          onCancel={() => setEditingTask(null)}
          isLoading={saving}
        />
      )}
    </div>
  );
}