import { camelCase } from "change-case";
import { assoc, is, reduce } from "ramda";

export const formatPhone = (phone?: string) =>
  phone && phone.replace(/[ \s\(\).-]*/g, "");

export const formatObjectKeys = (
  obj: any & {},
  fn: (value: string) => string = camelCase
): {[k: string]: any} => reduce(
  (prev, curr) => assoc(fn(curr), is(Object, obj[curr]) ? formatObjectKeys(obj[curr], fn) : obj[curr], prev),
  {},
  Object.keys(obj)
);
