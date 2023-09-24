import type {
  Task,
  addTask,
  getTasks,
  onTaskUpdate,
  updateTask,
} from '../state';
import type { RefDirective } from '../../dist/directives/ref';
import { html } from '../../dist/index';
import { Input } from '../components/input';
import { Btn } from '../components/btn';
import { createStyle } from '../helpers/create-style';

type Directives = RefDirective<{ input: HTMLInputElement }>;

type Props = {
  getTasks: typeof getTasks;
  addTask: typeof addTask;
  updateTask: typeof updateTask;
  onTaskUpdate: typeof onTaskUpdate;
};

const cssScope = createStyle({
  '.input-container': {
    marginBottom: '10px',
    display: 'flex',
  },
  '.check-all': {
    border: 'none',
    margin: '0 8px',
  },
});

export const TaskInput = ({
  getTasks,
  addTask,
  updateTask,
  onTaskUpdate,
}: Props) => {
  let allComplete = false;

  const areAllTasksComplete = () => {
    for (const [_, task] of getTasks()) {
      if (!task.complete) {
        return false;
      }
    }
    return true;
  };

  onTaskUpdate((tasks) => {
    for (const { task, operation } of tasks) {
      if (operation !== 'delete' && allComplete && !task.complete) {
        allComplete = false;
      } else {
        allComplete = areAllTasksComplete();
        break;
      }
    }
    tpl.$callbacks.run();
  });

  const tpl = html<HTMLFormElement, Directives>/* html */ `<form
    ${{ className: cssScope }}
    style="
      position: sticky;
      z-index: 1;
      top: 0;
      background: #fff;
      padding: 10px;
    "
  >
    <div class="input-container">
      ${Btn({
        size: 'lg',
        icon: 'check-circle',
        className: 'check-all',
        onclick: () => {
          const tasks = getTasks();

          if (!tasks.size) return;

          const complete = !allComplete;
          allComplete = complete;
          let updatedTasks = [] as Task[];
          for (const [_, task] of tasks) {
            updatedTasks.push({ ...task, complete });
          }
          updateTask(updatedTasks);
        },
        update: ({ attrMap }) => attrMap({ disabled: !getTasks().size }),
        updateIcon: () => (allComplete ? 'check-circle-fill' : 'check-circle'),
      })}
      ${Input({
        size: 'lg',
        placeholder: 'What needs to be done?',
        ref: 'input',
      })}
    </div>

    <div style="display: none">
      ${Btn({
        type: 'submit',
        onclick: (e) => {
          e.preventDefault();
          if (tpl.input.node.value) {
            addTask([tpl.input.node.value]);
          }
          tpl.input.node.value = '';
        },
      })}
    </div>
  </form>`;

  allComplete = areAllTasksComplete();
  tpl.$callbacks.run();

  return tpl;
};
