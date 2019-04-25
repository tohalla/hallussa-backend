import { camelCase } from "change-case";
import { assoc, is, reduce } from "ramda";

export const formatPhone = (phone?: string) =>
  phone && phone.replace(/[ \s\(\).-]*/g, "");

export const formatObjectKeys = (obj: {}, fn: (value: string) => string = camelCase) => reduce(
  (prev, curr) => assoc(fn(curr), is(Object, obj[curr]) ? formatObjectKeys(obj[curr], fn) : obj[curr], prev),
  {},
  Object.keys(obj)
);
