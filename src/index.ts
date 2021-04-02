import { ActionFragment, FragmentInstance } from "./core/Fragment";
import { Mesh } from "./core/Mesh";
import { ExpressRequest } from "./events/express-request";
import { ExpressApp } from "./resources/express-app";

const resource = (
  fragmentConstructor: any,
  params?: { nick?: String; parameters: Parameter[] }
) => new fragmentConstructor().instantiate(params);

const event = (
  fragmentConstructor: any,
  params?: {
    nick?: String;
    parameters: Parameter[];
    action?: FragmentInstance<ActionFragment>;
  }
) => new fragmentConstructor().instantiate(params);

const mesh = new Mesh({
  fragments: [resource(ExpressApp), event(ExpressRequest)],
});
mesh.run();
