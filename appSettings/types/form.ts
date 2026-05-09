// input
export interface tInput {
  title?: string;
  desc?: string;
  data: {
    dataType: "string" | "number" | "password";
    placeholder?: string;
  };
  rule: {
    string?: {
      minLength: number;
      maxLength: number;
      toContain?: string[];
      noToContain?: string[];
      stringPattern?: RegExp;
    };
    number?: {
      minValue: number;
      maxValue: number;
    };
  };
}
// select and switcher
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
