## About

**License**: MIT

**Author**: Lucas Santana do Nascimento Portela (<developer@lucasportela.dev>)

# MotiroJS Concept

Most software systems could be sort of abstracted in fragments. After some reasoning on how to simplify system coding and meaning, I defined three main fragment types in MotiroJS that work chained together to compose a clean and meaningful development design. These fragments, in its turn, get bounded by a piece of code called mesh.

# Fragment Types

- ## Resources
  Resources are the most static type of fragment. They can be seem like interfaces or services to access and use databases, apis, validators or any thing that can be considered intermediary in the system.
- ## Events

  An event fragment configures when some action should be triggered based on some system input, resource state change, etc. Events can load and use resources to configure listeners and so on.

- ## Actions

  Actions are business logic fragments that that finnaly gives some output from the system, they also can change resource state (like inserting one row in a database resource).

# Common Fragment Structure

All fragments will be stored in a particular folder and will have this structure:

- `fragment.json`

  - **type** `string`: The type of fragment. Can be `"resource"`, `"event"` or `"action"`.

  - **name** `string`: A short and clean fragment name in kebab case.

  - **description** `string`: A short description in Markdown explaning the use and responsabilities of the fragment.

  - **tags** `[string]`: An array listing tags related to the fragment, only for means of searching and categorization.

  - **dependencies** `[string]`: An array listing names of the fragments it depends on.

  - **npm** `{package: version}`: An object simmilar to `package.json`'s dependencies, listing NPM dependencies.

- `motiro.js`

  the fragment main code, exporting a default function with the parameters described in `motiro.json`

- `any other file/folder especific to the fragment`

# Mesh

You can think in fragments as definitions describing behaviors, relationships and structures. So on, you can think in mesh as the invocation or instantiation of those fragments. A fragment well be loaded only when instantiated in the mesh or when some instantiated fragment somehow depends on or calls it.

    // TODO
