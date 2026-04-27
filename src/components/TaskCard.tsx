'use client';
import { Task, TaskCardProps } from '@/types';

const statusStyles: Record<Task['status'], string> = {
  'todo':        'bg-slate-800/50 text-slate-300 border-slate-700/50',
  'in-progress': 'bg-indigo-900/30 text-indigo-300 border-indigo-700/50',
  'done':        'bg-emerald-900/30 text-emerald-300 border-emerald-700/50',
};

const statusLabels: Record<Task['status'], string> = {
  'todo':        'To Do',
  'in-progress': 'In Progress',
  'done':        'Done',
};

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="group relative bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/[0.08] p-5 shadow-lg shadow-black/20 hover:shadow-indigo-500/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none" />
      
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-100 truncate text-lg tracking-tight group-hover:text-indigo-200 transition-colors">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">{task.description}</p>
          )}
        </div>
        <span className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border shrink-0 ${statusStyles[task.status]}`}>
          {statusLabels[task.status]}
        </span>
      </div>

      <div className="relative flex items-center justify-between mt-6 pt-4 border-t border-white/[0.06]">
        <span className="text-xs text-slate-500 font-medium">
          {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <div className="flex gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-xs font-medium text-pink-500 hover:text-pink-400 hover:underline transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}