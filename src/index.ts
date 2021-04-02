import { event, mesh, resource, value } from "./core/helpers";
import { ExpressRequest } from "./events/express-request";
import { ExpressApp } from "./resources/express-app";

mesh([
  resource(ExpressApp),
  event(ExpressRequest, {
    parameters: [value("path", "/helloworld")],
  }),
]).run();
