// TYPES
// common types
export interface common_type {
  sub_tier: 0 | 1;
  username: string;
  email: string;
  icon: number;
}
// config
export interface config_type {
  first_login: boolean;
  lang: "ru" | "en";
  theme: "light" | "dark";
  monochrome: "mono" | "multi";
}
// body data
export interface body_general_type {
  gender: "male" | "female";
  age: number;
  height: number;
  activity: 1.15 | 1.3 | 1.45 | 1.6 | 1.75 | 1.9;
}
// weight & bf
export interface body_weight_bf_type {
  weight: number;
  bf: number;
}
// full body data
export interface body_data_type {
  general: body_general_type;
  current: body_weight_bf_type;
  goal: body_weight_bf_type;
}
// macros 
export interface macros_type {
  kcal: number;
  proteins: number;
  carbs: number;
  fats: number;
}
// full macros
export interface macros_data_type {
  current: macros_type;
  goal: macros_type;
}

// MAIN USER TYPE 
// full user
export interface new_format {
  id: string;
  online: boolean;
  friends: string[];
  common: common_type;
  config: config_type;
  body_data: body_data_type;
  macros_data: macros_data_type;
}
