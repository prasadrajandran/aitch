import { createPubSub } from './helpers/create-pub-sub';

export type Task = { id: string; complete: boolean; value: string };

export type Tasks = (typeof state)['tasks'];

export type ViewMode = 'all' | 'completed' | 'active';

const state = {
  viewMode: 'all' as ViewMode,
  tasks: new Map<Task['id'], Task>(),
};

export const [tasksUpdate, onTasksUpdate] =
  createPubSub<(typeof state)['tasks']>();
export const [taskUpdate, onTaskUpdate] = createPubSub<Task>();
export const [viewModeUpdate, onViewModeUpdate] = createPubSub<ViewMode>();

const commitTasks = () => {
  const taskObj: Record<Task['id'], Task> = {};
  state.tasks.forEach((v, k) => {
    taskObj[k] = v;
  });
  localStorage.setItem('tasks', JSON.stringify(taskObj));
};

export const retrieveTasks = () => {
  const data = JSON.parse(localStorage.getItem('tasks') || '{}') as Record<
    Task['id'],
    Task
  >;
  Object.entries(data).forEach(([k, v]) => {
    state.tasks.set(k, v);
  });
  tasksUpdate(state.tasks);
};

export const getTasks = () => state.tasks;

export const addTask = (value: Task['value']) => {
  const task = { id: crypto.randomUUID(), complete: false, value };
  state.tasks.set(task.id, task);
  tasksUpdate(state.tasks);
  commitTasks();
};

export const deleteTask = (taskId: Task['id']) => {
  state.tasks.delete(taskId);
  tasksUpdate(state.tasks);
  commitTasks();
};

export const updateTask = (task: Task) => {
  if (!task.value.trim()) {
    deleteTask(task.id);
  } else {
    state.tasks.set(task.id, task);
    taskUpdate(task);
    commitTasks();
  }
};

export const getTask = (taskId: Task['id']) => {
  const task = state.tasks.get(taskId);

  if (!task) {
    throw new Error(`Task "${taskId}" not found`);
  }

  // Returns a copy
  return {
    id: task.id,
    value: task.value,
    complete: task.complete,
  };
};

export const getViewMode = () => state.viewMode;

export const updateViewMode = (newViewMode: ViewMode) => {
  state.viewMode = newViewMode;
  window.location.hash = newViewMode;
  viewModeUpdate(state.viewMode);
};

export const retrieveViewMode = () => {
  const hash = window.location.hash.substring(1);
  switch (window.location.hash.substring(1)) {
    case 'all':
    case 'active':
    case 'completed':
      updateViewMode(hash as ViewMode);
      break;
  }
};
