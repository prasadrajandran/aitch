import { createPubSub } from './helpers/create-pub-sub';

type TaskUpdate = { task: Task; operation: 'add' | 'update' | 'delete' };

export type Task = { id: string; complete: boolean; value: string };

export type Tasks = (typeof state)['tasks'];

export type ViewMode = 'all' | 'completed' | 'active';

const state = {
  viewMode: 'all' as ViewMode,
  tasks: new Map<Task['id'], Task>(),
};

export const [taskUpdate, onTaskUpdate] = createPubSub<TaskUpdate[]>();
export const [viewModeUpdate, onViewModeUpdate] = createPubSub<ViewMode>();

const commitTasks = () => {
  queueMicrotask(() => {
    const taskObj: Record<Task['id'], Task> = {};
    state.tasks.forEach((v, k) => {
      taskObj[k] = v;
    });
    localStorage.setItem('tasks', JSON.stringify(taskObj));
  });
};

export const retrieveTasks = () => {
  const data = JSON.parse(localStorage.getItem('tasks') || '{}') as Record<
    Task['id'],
    Task
  >;
  Object.entries(data).forEach(([k, v]) => {
    state.tasks.set(k, v);
  });
};

export const getTasks = () => state.tasks;

export const addTask = (values: Task['value'][]) => {
  const addedTasks = values.reduce((tasks, value) => {
    if (value.trim()) {
      const task = { id: crypto.randomUUID(), complete: false, value };
      state.tasks.set(task.id, task);
      tasks.push({ task, operation: 'add' });
    }
    return tasks;
  }, [] as TaskUpdate[]);
  taskUpdate(addedTasks);
  commitTasks();
};

export const deleteTask = (taskIds: Task['id'][]) => {
  const deletedTasks = taskIds.reduce((tasks, taskId) => {
    const task = state.tasks.get(taskId);
    if (task) {
      state.tasks.delete(taskId);
      tasks.push({ task, operation: 'delete' });
    }
    return tasks;
  }, [] as TaskUpdate[]);
  taskUpdate(deletedTasks);
  commitTasks();
};

export const updateTask = (tasks: Task[]) => {
  const updatedTasks = tasks.reduce((t, task) => {
    if (task.value.trim()) {
      state.tasks.set(task.id, task);
      t.push({ task, operation: 'update' });
    } else {
      state.tasks.delete(task.id);
      t.push({ task, operation: 'delete' });
    }
    return t;
  }, [] as TaskUpdate[]);
  taskUpdate(updatedTasks);
  commitTasks();
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
