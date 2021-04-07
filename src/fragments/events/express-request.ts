import express from "express";
import { EventFragment, FragmentCodeContext } from "../../core/fragment";
import { ParameterValues, raw, slot } from "../../core/parameter";
import { ExpressApp } from "../resources/express-app";

export class ExpressRequest extends EventFragment {
  static method = {
    all: raw("use"),
    get: raw("get"),
    post: raw("post"),
    push: raw("push"),
    delete: raw("delete"),
  };

  static PATH = slot("/");
  static METHOD = slot(ExpressRequest.method.get);

  async code(
    parameters: ParameterValues,
    { mesh, instance }: FragmentCodeContext
  ) {
    const app: express.Application = await mesh.get(ExpressApp);
    const path = parameters.get(ExpressRequest.PATH);
    const method = parameters.get(ExpressRequest.METHOD);

    app[method](path, async (req, res, next) => {
      await instance.dispatch({ req, res, next });
    });
  }
}
