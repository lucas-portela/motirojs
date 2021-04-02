import { event, mesh, resource } from "./core/helpers";
import { Mesh } from "./core/Mesh";
import { ExpressRequest } from "./events/express-request";
import { ExpressApp } from "./resources/express-app";

mesh([resource(ExpressApp), event(ExpressRequest)]).run();
