// PRIVATE TYPES
// email
export interface email_type {
  email: string;
}
// email, language, theme, monochrome and friends list
export interface config_friends_type extends email_type {
  lang: "ru" | "en";
  theme: "light" | "dark";
  monochrome: "mono" | "multi";
  friends: string[];
}
// sub level
export interface sub_type {
  tier: 0 | 1;
}

// PUBLIC TYPES 
// username and icon
export interface username_icon_type {
  username: string;
  icon: number;
  firstLogin: boolean;
}
// goals
export interface body_goal_type {
  weight: number; 
  bf: number;
}
// body measurements
export interface body_measurements_type {
  age: number;
  height: number;
  activity: 1.15 | 1.3 | 1.45 | 1.6 | 1.75 | 1.9;
  weight: number; 
  bf: number;
}
// current, goal body stats and gender
export interface user_body_type {
  gender: "male" | "female";
  current: body_measurements_type;
  goal: body_goal_type;
}
// kcal, proteins, carbs and fats
export interface macros_type {
  kcal: number;
  proteins: number;
  carbs: number;
  fats: number;
}

// COMPOSITE TYPES 
// full user
export interface full_user_type {
  common: username_icon_type;
  private: config_friends_type;
  subscription: sub_type;
  body: user_body_type;
  macros: macros_type;
}

// SUPABASE TYPES
// supabase table user
export interface supabase_full_user_type {
  id: string;
  email: string;
  username: string;
  icon: number;
  first_login: boolean;
  subscription_tier: 0 | 1;
  lang: "ru" | "en";
  theme: "light" | "dark";
  monochrome: "mono" | "multi";
  friends: string[];
  body_data: {
    gender: "male" | "female";
    current: body_measurements_type;
    goal: body_goal_type;
  };
  macros_data: macros_type;
}
