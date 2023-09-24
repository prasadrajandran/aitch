import type { TextDirective } from '../../dist/directives/text';
import {
  Task,
  deleteTask,
  getTasks,
  getViewMode,
  onTaskUpdate,
  onViewModeUpdate,
  viewModeUpdate,
} from '../state';
import { html } from '../../dist/index';
import { _merge, _ref, _text } from '../../dist/directives';
import { Btn } from '../components/btn';
import { createStyle } from '../helpers/create-style';

type Directives = TextDirective<'taskCount'>;

type Props = {
  getTasks: typeof getTasks;
  getViewMode: typeof getViewMode;
  deleteTask: typeof deleteTask;
  updateViewMode: typeof viewModeUpdate;
  onTaskUpdate: typeof onTaskUpdate;
  onViewModeUpdate: typeof onViewModeUpdate;
};

const cssScope = createStyle({
  '.bar-container': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  '.item:nth-child(1), .item:nth-child(3)': {
    flexBasis: '170px',
  },
});

export const BottomBar = ({
  getTasks,
  getViewMode,
  updateViewMode,
  onTaskUpdate,
  onViewModeUpdate,
}: Props) => {
  let viewMode = getViewMode();

  onTaskUpdate(() => {
    tpl.$callbacks.run();
  });

  onViewModeUpdate((newViewMode) => {
    viewMode = newViewMode;
    tpl.$callbacks.run();
  });

  const tpl = html<HTMLElement, Directives>/* html */ `
    <div
      class="card"
      style="
        position: sticky;
        bottom: 0;
      "
      ${{ className: cssScope }}
    >
      <div class="card-body bar-container">
        <div
          class="text-muted item"
          ${({ node }) => {
            let count = 0;
            for (const [_, task] of getTasks()) {
              count += Number(!task.complete);
            }
            node.textContent = count
              ? `${count} item${count > 1 ? 's' : ''} remaining`
              : '';
          }}
        ></div>

        <div class="item">
          ${Btn({
            ariaLabel: 'See all tasks',
            child: 'All',
            onclick: () => updateViewMode('all'),
            update: ({ classMap }) => classMap({ active: viewMode === 'all' }),
          })}
          ${Btn({
            ariaLabel: 'See active tasks',
            child: 'Active',
            onclick: () => updateViewMode('active'),
            update: ({ classMap }) =>
              classMap({ active: viewMode === 'active' }),
          })}
          ${Btn({
            ariaLabel: 'See completed tasks',
            child: 'Completed',
            onclick: () => updateViewMode('completed'),
            update: ({ classMap }) =>
              classMap({ active: viewMode === 'completed' }),
          })}
        </div>

        <div class="text-muted item">
          <a
            href=""
            ${{
              onclick: (e) => {
                e.preventDefault();
                const ids: Task['id'][] = [];
                getTasks().forEach(({ id, complete }) => {
                  if (complete) {
                    ids.push(id);
                  }
                });
                deleteTask(ids);
              },
            }}
            ${({ show, hide }) => {
              const tasks = getTasks();

              if (!tasks.size) {
                hide();
                return;
              }

              for (const [_, task] of getTasks()) {
                if (task.complete) {
                  show();
                  return;
                }
              }
              hide();
            }}
            >Clear all completed</a
          >
        </div>
      </div>
    </div>
  `;

  tpl.$callbacks.run();

  return tpl;
};
