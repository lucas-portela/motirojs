class Parameter {
  type: String;
  name: String;
  constructor(name: String) {
    this.name = name;
  }
}

class ValueParameter extends Parameter {
  type: String = "value";
  value: any;

  constructor(name: String, value: any) {
    super(name);
    this.value = value;
  }
}

class ReferenceParameter extends Parameter {
  type: String = "reference";
  reference: String;

  constructor(name: String, reference: String) {
    super(name);
    this.reference = reference;
  }
}
