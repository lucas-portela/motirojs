import { Mesh } from "./core/Mesh";
import { ExpressApp } from "./resources/express-app";

const mesh = new Mesh({ fragments: [new ExpressApp().instantiate()] });
