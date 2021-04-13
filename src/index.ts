import { action, before, event, resource } from "./core/fragment";
import { mesh } from "./core/mesh";
import { ExpressResponse } from "./fragments/actions/express-response";
import { CheckAuth } from "./fragments/actions/check-auth";
import { ExpressRequest } from "./fragments/events/express-request";
import { ExpressApp } from "./fragments/resources/express-app";

mesh([
  // Application Resources
  resource(ExpressApp, [ExpressApp.PORT(8080)]),

  // Events
  event(ExpressRequest, [
    // Event parameters
    ExpressRequest.PATH("/hello"),
    // Action dispatched when event occurs
    action(ExpressResponse, [
      ExpressResponse.MESSAGE("Welcome to MotiroJS!"),
      before([
        // Authentication Hook
        action(CheckAuth),
      ]),
    ]),
  ]),
]).run();
