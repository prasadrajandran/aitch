import type { getViewMode, onViewModeUpdate, viewModeUpdate } from '../state';
import { html } from '../../dist/index';
import { _merge, _ref } from '../../dist/directives';
import { Btn } from '../fn-components/btn';

type Props = {
  getViewMode: typeof getViewMode;
  updateViewMode: typeof viewModeUpdate;
  onViewModeUpdate: typeof onViewModeUpdate;
};

export const BottomBar = ({
  getViewMode,
  updateViewMode,
  onViewModeUpdate,
}: Props) => {
  let viewMode = getViewMode();

  onViewModeUpdate((newViewMode) => {
    viewMode = newViewMode;
    tpl.$update();
  });

  const tpl = html`
    <div
      class="card"
      style="
        position: sticky;
        bottom: 0;
      "
    >
      <div class="card-body">
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
          update: ({ classMap }) => classMap({ active: viewMode === 'active' }),
        })}
        ${Btn({
          ariaLabel: 'See completed tasks',
          child: 'Completed',
          onclick: () => updateViewMode('completed'),
          update: ({ classMap }) =>
            classMap({ active: viewMode === 'completed' }),
        })}
      </div>
    </div>
  `;

  tpl.$update();

  return tpl;
};
