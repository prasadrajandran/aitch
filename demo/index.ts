import { html } from '../dist/index';
import { TasksElement } from './layout-components/tasks/tasks';
import { TaskInput } from './layout-components/task-input';
import { Heading } from './layout-components/heading';
import { BottomBar } from './layout-components/bottom-bar';
import {
  addTask,
  deleteTask,
  getTask,
  getTasks,
  getViewMode,
  onTaskUpdate,
  onViewModeUpdate,
  retrieveTasks,
  retrieveViewMode,
  updateTask,
  updateViewMode,
} from './state';

retrieveViewMode();
retrieveTasks();

document.body.append(
  html`
    <div class="container text-center" style="max-width: 800px">
      ${Heading()} ${TaskInput({ getTasks, addTask, updateTask, onTaskUpdate })}
      ${TasksElement({
        getViewMode,
        getTasks,
        getTask,
        updateTask,
        deleteTask,
        onTaskUpdate,
        onViewModeUpdate,
      })}
      ${BottomBar({
        getTasks,
        getViewMode,
        deleteTask,
        updateViewMode,
        onViewModeUpdate,
        onTaskUpdate,
      })}
    </div>
  `.$node
);
