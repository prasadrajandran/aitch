import type { Task } from '../state';
import type { RefDirective } from '../../dist/directives/ref';
import { html } from '../../dist/index';
import { Input } from '../fn-components/input';
import { Btn } from '../fn-components/btn';

type Directives = RefDirective<{ input: HTMLInputElement }>;

type Props = {
  addTask: (task: Task['value']) => void;
};

export const TaskInput = ({ addTask }: Props) => {
  const tpl = html<HTMLFormElement, Directives>/* html */ `<form>
    <p>
      ${Input({
        size: 'lg',
        placeholder: 'What needs to be done?',
        ref: 'input',
      })}
    </p>

    <div style="display: none">
      ${Btn({
        type: 'submit',
        onclick: (e) => {
          e.preventDefault();
          if (tpl.input.node.value) {
            addTask(tpl.input.node.value);
          }
          tpl.input.node.value = '';
        },
      })}
    </div>
  </form>`;

  tpl.$update();

  return tpl;
};
