// vInputString
export interface tInputString {
  title?: string;
  desc?: string;
  data: {
    dataType: "string" | "password";
    placeholder?: string;
  };
  rule: {
    minLength: number;
    maxLength: number;
    toContain?: string[];
    noToContain?: string[];
    stringPattern?: RegExp;
  };
}
// vInputNumber
export interface tInputNumber {
  title?: string;
  desc?: string;
  data: {
    dataType: "number";
    placeholder?: string;
  };
  rule: {
    minValue: number;
    maxValue: number;
  };
}
// select, vDuoSwitcher and vTrioSwitcher
export interface tSelectOpt {
  title: string;
  worth: string | number;
}
export interface tSelect {
  title?: string;
  desc?: string;
  data: {
    dataType: "string" | "number";
    opt: tSelectOpt[];
  };
}
