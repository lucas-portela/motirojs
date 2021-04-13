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

export type ParameterSlot<ValueType> = ((
  value: ParameterValue | ValueType
) => SlotBinding<ValueType>) & {
  defaultValue: ParameterValue;
};

export class SlotBinding<ValueType> {
  paramValue: ParameterValue;
  paramSlot: ParameterSlot<ValueType>;

  constructor(
    paramSlot: ParameterSlot<ValueType>,
    paramValue?: ParameterValue
  ) {
    this.paramValue = paramValue;
    this.paramSlot = paramSlot;
  }
}

export class ParameterValues {
  values: Map<ParameterSlot<any>, ParameterValue> = new Map<
    ParameterSlot<any>,
    ParameterValue
  >();

  constructor(paramSlot?: ParameterSlot<any>, paramValue?: ParameterValue) {
    if (paramSlot) this.add(paramSlot, paramValue);
  }

  add(paramSlot: ParameterSlot<any>, paramValue: ParameterValue) {
    this.values.set(paramSlot, paramValue);
    return this;
  }

  get(paramSlot: ParameterSlot<any>) {
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
export const slot = <ValueType>(
  defaultValue: ValueType | ParameterValue = undefined
) => {
  // Cast raw JS values to ParameterValue
  if (typeof (defaultValue as ParameterValue).value != "function")
    defaultValue = raw(defaultValue);
  var generator: any = (value: ValueType | ParameterValue) => {
    if (
      value !== undefined &&
      typeof (value as ParameterValue).value != "function"
    )
      value = raw(value);
    return new SlotBinding(generator, value as ParameterValue);
  };
  generator.defaultValue = defaultValue;

  return generator as ParameterSlot<ValueType>;
};
