import { html } from '../../dist/index';

export const Heading = () => {
  return html<HTMLHeadingElement>/* html */ `<h1 class="display-1">todos</h1>`;
};
