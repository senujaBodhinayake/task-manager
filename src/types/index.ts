// ── Auth ──────────────────────────────────────────
export interface AuthResponse {
  accessToken: string;
}

export interface AuthFormData {
  email: string;
  password: string;
}

// ── User ──────────────────────────────────────────
export interface User {
  _id: string;
  email: string;
  createdAt: string;
}

// ── Task ──────────────────────────────────────────
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

// ── API Responses ──────────────────────────────────
export interface ApiError {
  error: string | { message: string }[];
}

export interface ApiSuccess {
  message: string;
}

// ── Component Props ────────────────────────────────
export interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}