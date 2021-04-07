import {
  FragmentCodeContext,
  EventFragment,
  ActionFragment,
} from "../../core/fragment";
import { ParameterValues, slot } from "../../core/parameter";

export class CheckAuth extends ActionFragment {
  static MESSAGE = slot("You are not authenticated!");

  async code(parameters: ParameterValues, { shared }: FragmentCodeContext) {
    const { req, res } = shared;
    const message = parameters.get(CheckAuth.MESSAGE);

    if (!req.query.authenticated) {
      res.send(message);
      shared.overwrite = true;
    }
  }
}
