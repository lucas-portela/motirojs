import express from "express";
import { ResourceFragment, FragmentCodeContext } from "../core/Fragment";

export class ExpressApp extends ResourceFragment {
  constructor() {
    super();
    this.name = "express-app";
  }

  async code(parameters: Parameter[], { mesh }: FragmentCodeContext) {
    const app = express();
    const PORT = 8080;
    await new Promise((resolve) =>
      app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
        resolve;
      })
    );
    return app;
  }
}
