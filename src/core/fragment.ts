import { Mesh } from "./mesh";
import kebabCase from "kebab-case";
import { ParameterValue, ParameterValues, SlotBinding } from "./parameter";

export type FragmentCodeContext = {
  shared: any;
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

  async code(
    parameters: ParameterValues,
    { mesh }: FragmentCodeContext
  ): Promise<any> {
    throw new Error("Method not implemented.");
  }

  instantiate<FragmentType extends Fragment>(
    params?: FragmentInstanceParams<this>
  ): FragmentInstance<FragmentType> {
    return new FragmentInstance<FragmentType>({
      ...(params || {}),
      fragment: this as any,
    });
  }
}

export class ResourceFragment extends Fragment {
  isResource = true;
  constructor() {
    super();
    this.type = "resource";
    this.useInterventors = true;
    this.singleton = true;
  }
}

export class EventFragment extends Fragment {
  isEvent = true;
  constructor() {
    super();
    this.type = "event";
    this.useInterventors = true;
    this.singleton = true;
  }
}

export class ActionFragment extends Fragment {
  isAction = true;
  constructor() {
    super();
    this.type = "action";
    this.useInterventors = true;
    this.singleton = false;
  }
}

export type FragmentInstanceParams<FragmentType> = {
  nick?: String;
  groups?: String[];
  parameters?: ParameterValues;
  fragment?: FragmentType;
  action?: FragmentInstance<ActionFragment>;
  before?: FragmentInstance<ActionFragment>[];
  after?: FragmentInstance<ActionFragment>[];
};

export class FragmentInstance<FragmentType extends Fragment> {
  fragment: FragmentType;
  nick: String;
  groups: String[] = [];
  parameters: ParameterValues;
  before: FragmentInstance<ActionFragment>[] = [];
  after: FragmentInstance<ActionFragment>[] = [];
  action: FragmentInstance<ActionFragment> = null;
  mesh: Mesh;
  _data: any = null;

  async dispatch(shared: any = {}): Promise<any> {
    await this.action.eval(shared);
  }

  async eval(shared: any = {}): Promise<any> {
    if (this.fragment.singleton && this._data !== null) return this._data;
    let mainOverwrite = false;

    if (this.fragment.useInterventors)
      for (let interventor of this.before) {
        await interventor.eval(shared);
        if (shared.overwrite !== undefined) break;
      }

    if (shared.overwrite === undefined) {
      this._data = await this.fragment.code(this.parameters, {
        shared,
        instance: this,
        mesh: this.mesh,
      });
      if (shared.overwrite !== undefined) mainOverwrite = true;
    }

    if (shared.overwrite === undefined && this.fragment.useInterventors)
      for (let interventor of this.after) {
        await interventor.eval(shared);
        if (shared.overwrite !== undefined) break;
      }

    if (shared.overwrite !== undefined) {
      this._data = shared.overwrite;
      if (!mainOverwrite) delete shared.overwrite;
    }
    return this._data;
  }

  constructor(params: FragmentInstanceParams<FragmentType>) {
    this.nick = params.nick;
    this.groups = params.groups || this.groups;
    this.parameters = params.parameters || new ParameterValues();
    this.fragment = params.fragment;
    this.action = params.action || this.action;
    this.before = params.before || this.before;
    this.after = params.after || this.after;
  }
}

export class FragmentNamedParam<ValueType> {
  value: ValueType;
  constructor(value: ValueType) {
    this.value = value;
  }
}

export class Nick extends FragmentNamedParam<String> {}
export class Groups extends FragmentNamedParam<String[]> {}
export class Before extends FragmentNamedParam<
  FragmentInstance<ActionFragment>[]
> {}
export class After extends FragmentNamedParam<
  FragmentInstance<ActionFragment>[]
> {}

export const namedFragmentParams = (params: any[] = []) => {
  const named: FragmentInstanceParams<Fragment> = {
    parameters: new ParameterValues(),
  };
  params.forEach((param) => {
    switch (param.constructor.name) {
      case "Nick":
        named.nick = param.value;
        break;
      case "Groups":
        named.groups = param.value;
        break;
      case "Before":
        named.before = param.value;
        break;
      case "After":
        named.after = param.value;
        break;
      case "ParameterValues":
        named.parameters = param;
        break;
      case "SlotBinding":
        named.parameters.add(param.paramSlot, param.paramValue);
        break;
      default:
        if ((param.fragment || {}).type == "action") {
          named.action = param;
        }
        break;
    }
  });
  return named;
};

const fragmentCache: Map<any, Fragment> = new Map<any, Fragment>();

export type FragmentGeneratorParams = (
  | FragmentInstance<any>
  | Nick
  | Groups
  | Before
  | After
  | ParameterValues
  | SlotBinding<any>
)[];

const genericFragmentGenerator = <FragmentType extends Fragment>(
  fragmentConstructor: new () => FragmentType,
  params?: FragmentGeneratorParams
): FragmentInstance<FragmentType> => {
  const named = namedFragmentParams(params);
  const fragment =
    fragmentCache.get(fragmentConstructor) || new fragmentConstructor();
  return fragment.instantiate<FragmentType>(named);
};

export const resource = (
  fragmentConstructor: new () => ResourceFragment,
  params?: FragmentGeneratorParams
) => genericFragmentGenerator<ResourceFragment>(fragmentConstructor, params);

export const event = (
  fragmentConstructor: new () => EventFragment,
  params?: FragmentGeneratorParams
) => genericFragmentGenerator<EventFragment>(fragmentConstructor, params);

export const action = (
  fragmentConstructor: new () => ActionFragment,
  params?: FragmentGeneratorParams
) => genericFragmentGenerator<ActionFragment>(fragmentConstructor, params);

export const nick = (value: String) => new Nick(value);
export const groups = (groupNames: String[]) => new Groups(groupNames);
export const before = (value: FragmentInstance<ActionFragment>[]) =>
  new Before(value);
export const after = (value: FragmentInstance<ActionFragment>[]) =>
  new After(value);
