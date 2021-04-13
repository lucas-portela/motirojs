import {
  ActionFragment,
  EventFragment,
  Fragment,
  FragmentInstance,
  ResourceFragment,
} from "./fragment";

export class Mesh {
  fragments: FragmentInstance<Fragment>[] = [];

  constructor(fragments?: FragmentInstance<Fragment>[]) {
    this.add(fragments || []);
  }

  add(fragments: FragmentInstance<Fragment>[]) {
    this.fragments = this.fragments.concat(fragments);
    fragments.forEach((instance) => {
      instance.mesh = this;
    });
  }

  get resources(): FragmentInstance<ResourceFragment>[] {
    return this.fragments.filter(
      (instance) => instance.fragment && instance.fragment.type == "resource"
    ) as FragmentInstance<ResourceFragment>[];
  }

  get events(): FragmentInstance<EventFragment>[] {
    return this.fragments.filter(
      (instance) => instance.fragment && instance.fragment.type == "event"
    ) as FragmentInstance<EventFragment>[];
  }

  get actions(): FragmentInstance<ActionFragment>[] {
    return this.fragments.filter(
      (instance) => instance.fragment && instance.fragment.type == "action"
    ) as FragmentInstance<ActionFragment>[];
  }

  async get(query: { nick?: String; name?: String; shared?: any } | any) {
    let instance = this.fragments.find((instance) => {
      return (
        (query.nick && instance.nick == query.nick) ||
        (query.name && instance.fragment.name == query.name) ||
        (typeof query == "function" &&
          instance.fragment.name == Fragment._generateName(query.name))
      );
    });
    return await instance.eval(query.shared || {});
  }

  async run() {
    const events = this.events;
    for (let event of events) {
      await event.eval();
    }
  }
}

export const mesh = (fragments: FragmentInstance<Fragment>[]) =>
  new Mesh(fragments);
