import { Task, onTaskUpdate, onViewModeUpdate } from '../../state';
import type { RefDirective } from '../../../dist/directives/ref';
import type { TextDirective } from '../../../dist/directives/text';
import type { deleteTask, getViewMode, updateTask } from '../../state';
import { _ref, _text } from '../../../dist/directives';
import { html } from '../../../dist/index';
import { Btn } from '../btn';
import { Input } from '../input';

export type TaskProps = {
  getViewMode: typeof getViewMode;
  getTask: () => Task;
  updateTask: typeof updateTask;
  deleteTask: typeof deleteTask;
  onTaskUpdate: typeof onTaskUpdate;
  onViewModeUpdate: typeof onViewModeUpdate;
};

type TaskDirectives = RefDirective<{
  taskInput: HTMLInputElement;
}> &
  TextDirective<'task'>;

interface DomWatcherProps {
  connected?: () => void;
  disconnected?: () => void;
}

class DomWatcher extends HTMLElement {
  props: DomWatcherProps = {};
  constructor(props = {}) {
    super();
    this.props = props;
  }

  connectedCallback() {
    this.props.connected?.();
    console.warn('CONNECTED');
  }
  disconnectedCallback() {
    this.props.disconnected?.();
    console.warn('REMOVED');
  }
}

customElements.define('x-watcher', DomWatcher);

export const TaskElement = ({
  getViewMode,
  getTask,
  updateTask,
  deleteTask,
  onViewModeUpdate,
}: TaskProps) => {
  let viewMode = getViewMode();
  let task = getTask();
  let isEditing = false;
  let cancelOnViewModeUpdateListener: ReturnType<
    typeof onViewModeUpdate
  > | null = null;
  let cancelOnTaskUpdateListener: ReturnType<typeof onTaskUpdate> | null = null;

  const enableEditing = () => {
    isEditing = true;
    tpl.$update();
  };

  const updateTaskValue = () => {
    // Prevents this from firing more than once because it's attached to the
    // button and on the input.
    if (!isEditing) return;

    isEditing = false;
    task.value = tpl.taskInput.node.value;
    updateTask(task);
    tpl.$update();
  };

  const watcher = new DomWatcher({
    connected: () => {
      cancelOnViewModeUpdateListener?.();
      cancelOnTaskUpdateListener?.();

      cancelOnViewModeUpdateListener = onViewModeUpdate((newViewMode) => {
        viewMode = newViewMode;
        tpl.$update();
      });

      cancelOnTaskUpdateListener = onTaskUpdate((updatedTask) => {
        console.warn(updatedTask.id);
        if (task.id === updatedTask.id) {
          task = updatedTask;
          tpl.task = task.value;
          tpl.$update();
        }
      });

      task = getTask();
      tpl.task = task.value;
      tpl.$update();
    },
    disconnected: () => {
      cancelOnViewModeUpdateListener?.();
      cancelOnTaskUpdateListener?.();
    },
  });

  const tpl = html<HTMLLIElement, TaskDirectives>/* html */ `
    <li
      class="list-group-item"
      ${({ show, hide }) => {
        const { complete } = task;
        if (viewMode === 'all') {
          show();
        } else if (viewMode === 'completed' && complete) {
          show();
        } else if (viewMode === 'active' && !complete) {
          show();
        } else {
          hide();
        }
      }}
    >
      ${watcher}
      <form class="task-form" ${{ onsubmit: (e) => e.preventDefault() }}>
        ${Btn({
          icon: 'check-circle',
          className: 'status-btn',
          onclick: () => {
            task.complete = !task.complete;
            updateTask(task);
            tpl.$update();
          },
          update: ({ attrs }) =>
            attrs({
              ariaLabel: `Mark "${task.value}" as${
                task.complete ? ' not ' : ' '
              }done`,
            }),
        })}

        <div
          class="task-content"
          ${{ ondblclick: () => !task.complete && enableEditing() }}
        >
          ${Input({
            size: 'sm',
            value: task.value,
            ref: 'taskInput',
            onblur: updateTaskValue,
            update: ({ node, show, hide }) => {
              if (isEditing) {
                show();
                node.focus();
              } else {
                hide();
              }
            },
          })}
          <span
            ${({ show, hide, style, classMap }) => {
              const { complete } = task;
              isEditing ? hide() : show();
              classMap({ 'text-muted': complete });
              style({
                textDecoration: complete ? 'line-through' : '',
                fontStyle: complete ? 'italic' : '',
              });
            }}
            >${_text('task')}</span
          >
        </div>

        ${Btn({
          icon: 'pencil',
          className: 'task-btn',
          onclick: enableEditing,
          update: ({ attrs, show, hide }) => {
            const { value, complete } = task;
            isEditing || complete ? hide() : show();
            attrs({ ariaLabel: `Edit "${value}" task` });
          },
        })}
        ${Btn({
          type: 'submit',
          icon: 'save',
          className: 'task-btn',
          onclick: updateTaskValue,
          update: ({ show, hide, attrs }) => {
            isEditing ? show() : hide();
            attrs({ ariaLabel: `Update "${task.value}" task` });
          },
        })}
        ${Btn({
          icon: 'trash3',
          className: 'task-btn',
          classType: 'danger',
          onclick: () => deleteTask(task.id),
          update: ({ attrs }) => {
            attrs({ ariaLabel: `Delete "${task.value}" task` });
          },
        })}
      </form>
    </li>
  `;

  return tpl;
};
