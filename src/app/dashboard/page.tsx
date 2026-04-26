'use client';
import { useEffect, useState } from 'react';
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

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !accessToken) router.push('/login');
  }, [accessToken, authLoading]);

  // Fetch tasks
  useEffect(() => {
    if (accessToken) fetchTasks();
  }, [accessToken]);

  async function fetchTasks() {
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
  }

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
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
            <p className="text-sm text-gray-500 mt-1">{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            + New Task
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6">
            {error}
            <button onClick={() => setError('')} className="ml-2 underline">Dismiss</button>
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          /* Kanban columns */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(Object.entries(grouped) as [Task['status'], Task[]][]).map(([status, items]) => (
              <div key={status}>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {status === 'todo' ? 'To Do' : status === 'in-progress' ? 'In Progress' : 'Done'}
                  <span className="ml-2 text-gray-400">({items.length})</span>
                </h2>
                <div className="space-y-3">
                  {items.length === 0 ? (
                    <div className="bg-white rounded-xl border border-dashed border-gray-200 p-5 text-center text-sm text-gray-400">
                      No tasks
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