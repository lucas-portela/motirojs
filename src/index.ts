import { action, before, event, resource } from "./core/fragment";
import { group } from "./core/group";
import { mesh } from "./core/mesh";
import { parameter, raw } from "./core/parameter";
import { ExpressResponse } from "./fragments/actions/express-response";
import { CheckAuth } from "./fragments/actions/check-auth";
import { ExpressRequest } from "./fragments/events/express-request";
import { ExpressApp } from "./fragments/resources/express-app";

mesh([
  resource(ExpressApp),
  event(ExpressRequest, [
    parameter(ExpressRequest.PATH, raw("/hello")).parameter(
      ExpressRequest.METHOD,
      ExpressRequest.method.all
    ),
    action(ExpressResponse, [
      before([action(CheckAuth)]),
      parameter(ExpressResponse.MESSAGE, raw("Welcome to MotiroJS!")),
    ]),
  ]),
]).run();
