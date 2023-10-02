import type { ListDirective } from '../../../dist/directives/list';
import type {
  Task,
  ViewMode,
  getTask,
  getTasks,
  onTaskUpdate,
  onViewModeUpdate,
} from '../../state';
import { html } from '../../../dist/index';
import { _list } from '../../../dist/directives';
import { createStyle } from '../../helpers/create-style';
import { TaskElement, TaskProps } from './task';

type TasksProps = {
  getViewMode: () => ViewMode;
  getTasks: typeof getTasks;
  getTask: typeof getTask;
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
    marginLeft: '11px',
    marginRight: '25px',
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
  onViewModeUpdate,
}: TasksProps) => {
  onTaskUpdate((tasks) => {
    if (tasks.some(({ operation }) => operation !== 'update')) {
      tpl.tasks = getTasks();
    }
    tpl.$cb.run();
  });

  const tpl = html<DocumentFragment, TasksDirectives>/* html */ `
    <ol
      class="list-group list-group-flush text-start"
      ${{ className: cssScope }}
      ${_list({
        name: 'tasks',
        items: getTasks(),
        node: (task) =>
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

  tpl.$cb.run();

  return tpl;
};
