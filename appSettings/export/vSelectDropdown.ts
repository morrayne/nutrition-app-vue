 import type { tSelectOpt, tSelect } from "../types/form";
 const intakeTypeOpt: tSelectOpt[] = [
   { title: "breakfast", worth: "breakfast" },
   { title: "lunch", worth: "lunch" },
   { title: "supper", worth: "supper" },
   { title: "dinner", worth: "dinner" },
   { title: "snack", worth: "snack" },
 ];
 export const intakeType: tSelect = {
  title: "intakeTime",
   data: {
     dataType: "string",
     opt: intakeTypeOpt,
   },
 };
 