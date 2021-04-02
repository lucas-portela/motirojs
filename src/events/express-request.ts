import express from "express";
import { FragmentCodeContext, EventFragment } from "../core/Fragment";
import { ExpressApp } from "../resources/express-app";

export class ExpressRequest extends EventFragment {
  async code(parameters: Parameter[], { mesh }: FragmentCodeContext) {
    const app: express.Application = await mesh.get(ExpressApp);
    app.get("/", (req, res) => {
      res.send("<h1>Some HTML</h1><p>Even more HTML</p>");
    });
  }
}
