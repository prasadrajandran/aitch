import { html } from '../dist/index';
import { _ref } from '../dist/directives';
import { TasksElement } from './components/tasks/tasks';
import { TaskInput } from './components/task-input';
import { Heading } from './components/heading';
import { BottomBar } from './components/bottom-bar';
import {
  addTask,
  deleteTask,
  getTask,
  getTasks,
  getViewMode,
  onTaskUpdate,
  onTasksUpdate,
  onViewModeUpdate,
  retrieveTasks,
  retrieveViewMode,
  updateTask,
  updateViewMode,
} from './state';

const template = html`
  <div class="container text-center" style="max-width: 800px" ${_ref('ctn')}>
    ${Heading()} ${TaskInput({ addTask })}
    ${TasksElement({
      getViewMode,
      getTasks,
      getTask,
      updateTask,
      deleteTask,
      onTaskUpdate,
      onTasksUpdate,
      onViewModeUpdate,
    })}
    ${BottomBar({ getViewMode, updateViewMode, onViewModeUpdate })}
  </div>
`;

retrieveViewMode(); // Run this before retrieving tasks.
retrieveTasks();

document.body.append(template.$node);
