import _ from "lodash";

import { GenericObject } from "../../types/Common";
import { IXFilterFunction } from "../../types/XFilter";

const include: IXFilterFunction<
  any,
  any,
  IXFilterFunctionIncludeOpts,
  GenericObject
> = function include(
  payload: any,
  opts?: IXFilterFunctionIncludeOpts,
  ref?: GenericObject
): any {
  if (typeof payload !== "string" && !Array.isArray(payload)) return payload;
  if (!opts?.values || !opts.set) return payload;

  let values = Array.isArray(opts.values) ? opts.values : [opts.values];
  values = values.map((value) =>
    value.startsWith("$") ? _.get(ref, value) : value
  );

  const isOK = values.every((value) => payload.includes(value));
  if (!isOK) return payload;

  if (typeof opts.set === "string") {
    return opts.set.startsWith("$") ? _.get(ref, opts.set) : opts.set;
  }

  return opts.set;
};

export default include;
export interface IXFilterFunctionIncludeOpts {
  values: string | string[];
  set: any;
}
