import { isArray as lodashIsArray } from "lodash";

// solving issue https://github.com/Microsoft/TypeScript/issues/17002
export function isArray(value?: any): value is any[] | readonly any[] {
  return lodashIsArray(value);
}
