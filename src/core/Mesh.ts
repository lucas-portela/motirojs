import {
  ActionFragment,
  EventFragment,
  Fragment,
  FragmentInstance,
  ResourceFragment,
} from "./Fragment";

export class Mesh {
  fragments: FragmentInstance<Fragment>[] = [];

  constructor(params: { fragments: FragmentInstance<Fragment>[] }) {
    this.add(this.fragments);
  }

  add(fragments: FragmentInstance<Fragment>[]) {
    this.fragments = this.fragments.concat(fragments);
    fragments.forEach((instance) => {
      instance.mesh = this;
    });
  }

  get resources(): FragmentInstance<ResourceFragment>[] {
    return this.fragments.filter(
      (instance) => instance.fragment.type == "resource"
    );
  }

  get events(): FragmentInstance<EventFragment>[] {
    return this.fragments.filter(
      (instance) => instance.fragment.type == "event"
    );
  }

  get actions(): FragmentInstance<ActionFragment>[] {
    return this.fragments.filter(
      (instance) => instance.fragment.type == "action"
    );
  }

  async get(params: { nick?: String; name?: String; message?: any }) {
    let instance = this.fragments.find((instance) => {
      return (
        (params.nick && instance.nick == params.nick) ||
        (params.name && instance.fragment.name == params.name)
      );
    });
    return await instance.eval(params.message || {});
  }

  async run() {
    const events = this.events;
    for (let event of events) {
      event.eval();
    }
  }
}
