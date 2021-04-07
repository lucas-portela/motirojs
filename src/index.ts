import { action, before, event, resource } from "./core/fragment";
import { group } from "./core/group";
import { mesh } from "./core/mesh";
import { parameter, raw } from "./core/parameter";
import { ExpressResponse } from "./fragments/actions/express-response";
import { CheckAuth } from "./fragments/actions/check-auth";
import { ExpressRequest } from "./fragments/events/express-request";
import { ExpressApp } from "./fragments/resources/express-app";

mesh([
  // Application Resources
  resource(ExpressApp, [parameter(ExpressApp.PORT, 8080)]),

  // Events
  event(ExpressRequest, [
    // Event parameters
    parameter(ExpressRequest.PATH, "/hello"),
    // Action dispatched when event occurs
    action(ExpressResponse, [
      before([
        // Authentication Hook
        action(CheckAuth),
      ]),
      parameter(ExpressResponse.MESSAGE, "Welcome to MotiroJS!"),
    ]),
  ]),
]).run();
