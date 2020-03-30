import _ from "lodash";

import { GenericObject } from "../types/Common";
import { IXFilterFunction } from "../types/XFilter";

const set: IXFilterFunction<
  any,
  any,
  IXFilterFunctionGetOpts,
  GenericObject
> = function set(
  payload: any,
  opts?: IXFilterFunctionGetOpts,
  ref?: GenericObject
): any {
  const { value, override = true } = { ...opts };

  if (payload && !override) return payload;

  if (typeof value === "string" && value.startsWith("$")) {
    return _.get(ref, value);
  }

  return value;
};

export default set;
export interface IXFilterFunctionGetOpts {
  value?: any;
  override?: boolean;
}
