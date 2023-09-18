import type { ListDirective } from '../../../dist/directives/list';
import type {
  Task,
  ViewMode,
  getTask,
  getTasks,
  onTaskUpdate,
  onTasksUpdate,
  onViewModeUpdate,
} from '../../state';
import { html } from '../../../dist/index';
import { _list, _merge, _ref, _text } from '../../../dist/directives';
import { createStyle } from '../../helpers/create-style';
import { TaskElement, TaskProps } from './task';

type TasksProps = {
  getViewMode: () => ViewMode;
  getTasks: typeof getTasks;
  getTask: typeof getTask;
  onTasksUpdate: typeof onTasksUpdate;
  onTaskUpdate: typeof onTaskUpdate;
  onViewModeUpdate: typeof onViewModeUpdate;
} & Omit<TaskProps, 'getTask'>;

type TasksDirectives = ListDirective<{ tasks: Map<Task['id'], Task> }>;

const cssScope = createStyle({
  '.task-form': {
    display: 'flex',
    alignItems: 'center',
  },
  '.task-btn': {
    border: 'none',
    borderRadius: '50px',
    padding: '6px',
    margin: '0',
    flexBasis: '36px',
  },
  '.status-btn': {
    marginRight: '10px',
  },
  '.task-content': {
    flexBasis: '100%',
  },
});

export const TasksElement = ({
  getViewMode,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  onTaskUpdate,
  onTasksUpdate,
  onViewModeUpdate,
}: TasksProps) => {
  onTasksUpdate((tasks) => {
    tpl.tasks = tasks;
  });

  const tpl = html<DocumentFragment, TasksDirectives>/* html */ `
    <ol
      class="list-group text-start"
      ${{ className: cssScope }}
      ${_list({
        name: 'tasks',
        items: getTasks(),
        element: (task) =>
          TaskElement({
            getViewMode,
            getTask: () => getTask(task.id),
            updateTask,
            deleteTask,
            onTaskUpdate,
            onViewModeUpdate,
          }),
      })}
    ></ol>
  `;

  tpl.$update();

  return tpl;
};
