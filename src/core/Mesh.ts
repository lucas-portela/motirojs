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
    this.add(params.fragments || []);
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

  async get(query: { nick?: String; name?: String; message?: any } | any) {
    let instance = this.fragments.find((instance) => {
      return (
        (query.nick && instance.nick == query.nick) ||
        (query.name && instance.fragment.name == query.name) ||
        (typeof query == "function" &&
          instance.fragment.name == Fragment._generateName(query.name))
      );
    });
    return await instance.eval(query.message || {});
  }

  async run() {
    const events = this.events;
    for (let event of events) {
      await event.eval();
    }
  }
}
