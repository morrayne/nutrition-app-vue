import type { tSelectOpt, tSelect } from "../types/form";
const intakeOpt: tSelectOpt[] = [
  { title: "basket", worth: "basket" },
  { title: "products", worth: "products" },
  { title: "meals", worth: "meals" },
];
export const intake: tSelect = {
  data: {
    dataType: "string",
    opt: intakeOpt,
  },
};