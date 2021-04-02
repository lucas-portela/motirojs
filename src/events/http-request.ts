import express from "express";
import { FragmentCodeContext, EventFragment } from "../core/Fragment";

export class HttpRequest extends EventFragment {
  constructor() {
    super();
    this.name = "http-request";
  }

  async code(parameters: Parameter[], { mesh }: FragmentCodeContext) {
    const app: express.Application = await mesh.get({ name: "express-app" });
    app.get("/", (req, res) => {
      res.send("<h1>Some HTML</h1>");
      res.send("<p>Even more HTML</p>");
    });
  }
}
