interface LifecycleCallbacksProps {
  connected?: () => void;
  disconnected?: () => void;
}

export class LifecycleCallbacks extends HTMLElement {
  props: LifecycleCallbacksProps = {};
  constructor(props = {}) {
    super();
    this.props = props;
  }

  connectedCallback() {
    this.props.connected?.();
  }

  disconnectedCallback() {
    this.props.disconnected?.();
  }
}

customElements.define('x-lifecycle-callbacks', LifecycleCallbacks);
