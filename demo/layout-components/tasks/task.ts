import type { RefDirective } from '../../../dist/directives/ref';
import type { TextDirective } from '../../../dist/directives/text';
import type { deleteTask, getViewMode, updateTask } from '../../state';
import { Task, onTaskUpdate, onViewModeUpdate } from '../../state';
import { _ref, _text } from '../../../dist/directives';
import { html } from '../../../dist/index';
import { LifecycleCallbacks } from '../../helpers/lifecycle-callbacks';
import { Btn } from '../../components/btn';
import { Input } from '../../components/input';
import { Listeners } from '../../helpers/listeners';

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

export const TaskElement = ({
  getViewMode,
  getTask,
  updateTask,
  deleteTask,
  onViewModeUpdate,
}: TaskProps) => {
  const listeners = new Listeners();
  let viewMode = getViewMode();
  let task = getTask();
  let isEditing = false;

  const enableEditing = () => {
    isEditing = true;
    tpl.$cb.run();
  };

  const updateTaskValue = () => {
    // Prevents this from firing more than once because it's attached to the
    // button and the update task input element.
    if (!isEditing) return;

    isEditing = false;
    task.value = tpl.taskInput.node.value;
    updateTask([task]);
    tpl.$cb.run();
  };

  const watcher = new LifecycleCallbacks({
    connected: () => {
      listeners.cancel();
      listeners.push(
        onViewModeUpdate((newViewMode) => {
          viewMode = newViewMode;
          tpl.$cb.run();
        }),
      );
      listeners.push(
        onTaskUpdate((tasks) => {
          const updatedTask = tasks.find(({ task: { id } }) => task.id === id);
          if (updatedTask) {
            task = updatedTask.task;
            tpl.task = task.value;
            tpl.$cb.run();
          }
        }),
      );

      task = getTask();
      tpl.task = task.value;
      tpl.$cb.run();
    },
    disconnected: () => {
      listeners.cancel();
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
          size: 'sm',
          icon: 'check-circle',
          className: 'task-btn status-btn',
          onclick: () => {
            task.complete = !task.complete;
            updateTask([task]);
            tpl.$cb.run();
          },
          update: ({ attrs }) =>
            attrs({
              ariaLabel: `Mark "${task.value}" as${
                task.complete ? ' not ' : ' '
              }done`,
            }),
          updateIcon: () =>
            task.complete ? 'check-circle-fill' : 'check-circle',
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
          size: 'sm',
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
          size: 'sm',
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
          variant: 'danger',
          onclick: () => deleteTask([task.id]),
          update: ({ attrs }) => {
            attrs({ ariaLabel: `Delete "${task.value}" task` });
          },
        })}
      </form>
    </li>
  `;

  tpl.$cb.run();

  return tpl;
};
