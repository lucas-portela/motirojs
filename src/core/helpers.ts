import { ActionFragment, Fragment, FragmentInstance } from "./Fragment";
import { Mesh } from "./Mesh";

export const mesh = (fragments: FragmentInstance<Fragment>[]) =>
  new Mesh(fragments);
export const resource = (
  fragmentConstructor: any,
  params?: { nick?: String; parameters: Parameter[] }
) => new fragmentConstructor().instantiate(params);

export const event = (
  fragmentConstructor: any,
  params?: {
    nick?: String;
    parameters: Parameter[];
    action?: FragmentInstance<ActionFragment>;
  }
) => new fragmentConstructor().instantiate(params);
