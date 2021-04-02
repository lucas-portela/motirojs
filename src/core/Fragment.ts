import { Mesh } from "./Mesh";
import kebabCase from "kebab-case";

export type FragmentCodeContext = {
  message: any;
  instance: FragmentInstance<Fragment>;
  mesh: Mesh;
};

export class Fragment {
  dependencies: String[] = [];
  type: "resource" | "event" | "action" = "event";
  singleton: boolean = false;
  useInterventors: boolean = true;

  get name() {
    return Fragment._generateName(this.constructor.name);
  }

  static _generateName(originalName) {
    return kebabCase(originalName).slice(1);
  }

  code(parameters: Parameter[], context: FragmentCodeContext): Promise<any> {
    throw new Error("Method not implemented.");
  }

  instantiate(params?: {
    parameters?: Parameter[];
    nick?: String;
    action?: FragmentInstance<ActionFragment>;
    before?: FragmentInstance<ActionFragment>[];
    after?: FragmentInstance<ActionFragment>[];
  }): FragmentInstance<Fragment> {
    return new FragmentInstance({ ...(params || {}), fragment: this });
  }
}

export class ResourceFragment extends Fragment {
  constructor() {
    super();
    this.type = "resource";
    this.useInterventors = true;
    this.singleton = true;
  }
}

export class EventFragment extends Fragment {
  constructor() {
    super();
    this.type = "event";
    this.useInterventors = true;
    this.singleton = true;
  }
}

export class ActionFragment extends Fragment {
  constructor() {
    super();
    this.type = "action";
    this.useInterventors = true;
    this.singleton = false;
  }
}

export class FragmentInstance<FragmentType extends Fragment> {
  fragment: FragmentType;
  nick: String;
  parameters: Parameter[];
  before: FragmentInstance<ActionFragment>[] = [];
  after: FragmentInstance<ActionFragment>[] = [];
  action: FragmentInstance<ActionFragment>[] = [];
  mesh: Mesh;
  _data: any = null;

  async eval(message: any = {}): Promise<any> {
    if (this.fragment.singleton && this._data !== null) return this._data;
    if (this.fragment.useInterventors)
      for (let interventor of this.before) {
        await interventor.eval(message);
        if (message.overwrite !== undefined) {
          delete message.overwrite;
          this._data = message.overwrite;
        }
      }

    this._data =
      this._data ||
      (await this.fragment.code(this.parameters, {
        message,
        instance: this,
        mesh: this.mesh,
      }));

    if (message.overwrite !== undefined) {
      delete message.overwrite;
      this._data = message.overwrite;
    }

    if (this.fragment.useInterventors)
      for (let interventor of this.after) {
        await interventor.eval(message);
        if (message.overwrite !== undefined) {
          delete message.overwrite;
          this._data = message.overwrite;
        }
      }
    return this._data;
  }

  constructor(params: {
    nick?: String;
    parameters?: Parameter[];
    fragment?: FragmentType;
    action?: FragmentInstance<ActionFragment>;
    before?: FragmentInstance<ActionFragment>[];
    after?: FragmentInstance<ActionFragment>[];
  }) {
    this.nick = params.nick;
    this.parameters = params.parameters || [];
    this.fragment = params.fragment;
    this.before = params.before || this.before;
    this.after = params.after || this.after;
  }
}
