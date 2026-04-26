'use client';
import { Task, TaskCardProps } from '@/types';

const statusStyles: Record<Task['status'], string> = {
  'todo':        'bg-gray-100 text-gray-600',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  'done':        'bg-green-100 text-green-700',
};

const statusLabels: Record<Task['status'], string> = {
  'todo':        'To Do',
  'in-progress': 'In Progress',
  'done':        'Done',
};

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${statusStyles[task.status]}`}>
          {statusLabels[task.status]}
        </span>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-gray-400">
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="text-xs text-blue-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-xs text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}