export class ParameterValue {
  type: String;

  value() {
    return null;
  }
}

export class Raw extends ParameterValue {
  type: String = "value";
  data: any;

  constructor(value: any) {
    super();
    this.data = value;
  }

  value() {
    return this.data;
  }
}

export class Reference extends ParameterValue {
  type: String = "reference";
  reference: String;

  constructor(reference: String) {
    super();
    this.reference = reference;
  }

  value() {
    throw Error("Not implemented!");
  }
}

// export class ParameterSlot {
//   defaultValue: ParameterValue;
//   constructor(defaultValue?) {
//     this.defaultValue = defaultValue;
//   }
// }

export type ParameterSlot = ((value: ParameterValue | any) => void) & {
  defaultValue: ParameterValue;
};
export class SlotBinding {
  paramValue: ParameterValue;
  paramSlot: ParameterSlot;

  constructor(paramSlot: ParameterSlot, paramValue?: ParameterValue) {
    this.paramValue = paramValue;
    this.paramSlot = paramSlot;
  }
}

export class ParameterValues {
  values: Map<ParameterSlot, ParameterValue> = new Map<
    ParameterSlot,
    ParameterValue
  >();

  constructor(paramSlot?: ParameterSlot, paramValue?: ParameterValue) {
    if (paramSlot) this.add(paramSlot, paramValue);
  }

  add(paramSlot: ParameterSlot, paramValue: ParameterValue) {
    this.values.set(paramSlot, paramValue);
    return this;
  }

  get(paramSlot: ParameterSlot) {
    let paramValue = this.values.get(paramSlot);
    let value = paramValue ? paramValue.value() : undefined;
    if (value === undefined)
      value = paramSlot.defaultValue
        ? paramSlot.defaultValue.value()
        : undefined;
    return value;
  }
}

export const raw = (value: any) => new Raw(value);
export const reference = (name: String) => new Reference(name);
export const slot = (defaultValue: any = undefined) => {
  // Cast raw JS values to ParameterValue
  if (typeof defaultValue.value != "function") defaultValue = raw(defaultValue);
  var generator: any = (value: any) => {
    if (value !== undefined && typeof value.value != "function")
      value = raw(value);
    return new SlotBinding(generator, value);
  };
  generator.defaultValue = defaultValue;

  return generator as ParameterSlot;
};
