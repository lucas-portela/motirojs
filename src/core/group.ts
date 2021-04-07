import {
  ActionFragment,
  Fragment,
  FragmentInstance,
  FragmentInstanceParams,
  namedFragmentParams,
} from "./fragment";
import { Mesh } from "./mesh";
import { ParameterValues } from "./parameter";

export class Group {
  name: String;
  parameters: ParameterValues;
  before: FragmentInstance<ActionFragment>[] = [];
  after: FragmentInstance<ActionFragment>[] = [];
  action: FragmentInstance<ActionFragment> = null;
  mesh: Mesh;

  constructor(name: String, params: FragmentInstanceParams<Fragment>) {
    this.name = name;
    this.parameters = params.parameters || new ParameterValues();
    this.action = params.action || this.action;
    this.before = params.before || this.before;
    this.after = params.after || this.after;
  }
}

export const group = (name: String, params: any[]) => {
  const named = namedFragmentParams(params);
  return new Group(name, named);
};
