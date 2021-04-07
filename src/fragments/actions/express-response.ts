import {
  FragmentCodeContext,
  EventFragment,
  ActionFragment,
} from "../../core/fragment";
import { ParameterValues, slot } from "../../core/parameter";

export class ExpressResponse extends ActionFragment {
  static MESSAGE = slot("Express Response ;)");

  async code(
    parameters: ParameterValues,
    { shared: { req, res } }: FragmentCodeContext
  ) {
    const message = parameters.get(ExpressResponse.MESSAGE);
    res.send(message);
  }
}
