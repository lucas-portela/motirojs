import express from "express";
import { FragmentCodeContext, ResourceFragment } from "../../core/fragment";
import { ParameterValues, slot } from "../../core/parameter";
export class ExpressApp extends ResourceFragment {
  static PORT = slot(8080);

  async code(parameters: ParameterValues, { mesh }: FragmentCodeContext) {
    const port = parameters.get(ExpressApp.PORT);
    const app = express();

    await new Promise((resolve: any) =>
      app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
        resolve();
      })
    );
    return app;
  }
}
