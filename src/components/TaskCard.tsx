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



function DueDateBadge({ due_date }: { due_date: string }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);

  // Parse manually to avoid timezone shifting
  const [year, month, day] = due_date.slice(0, 10).split('-').map(Number);
  const due = new Date(year, month - 1, day); // local midnight, no timezone issues

  if (isNaN(due.getTime())) return null; // guard against any bad value

  const diff  = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const label = due.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  let colorClass: string;
  let prefix: string;

  if (diff < 0) {
    colorClass = 'text-pink-400';
    prefix = 'Overdue · ';
  } else if (diff === 0) {
    colorClass = 'text-amber-400';
    prefix = 'Due today · ';
  } else if (diff <= 3) {
    colorClass = 'text-amber-400';
    prefix = `Due in ${diff}d · `;
  } else {
    colorClass = 'text-slate-400';
    prefix = 'Due · ';
  }

  return (
    <div className={`flex items-center gap-1.5 ${colorClass}`}>
      <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={1.5}>
        <rect x="1" y="2" width="12" height="11" rx="2" />
        <line x1="5" y1="1" x2="5" y2="3" />
        <line x1="9" y1="1" x2="9" y2="3" />
        <line x1="1" y1="6" x2="13" y2="6" />
      </svg>
      <span className="text-xs font-medium">{prefix}{label}</span>
    </div>
  );
}

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

      {/* Due date row — only shown when set */}
      {task.due_date && (
        <div className="relative mt-3">
          <DueDateBadge due_date={task.due_date} />
        </div>
      )}

      <div className="relative flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
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