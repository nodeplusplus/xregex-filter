import _ from "lodash";

import { GenericObject } from "../types/Common";
import { IXFilterFunction } from "../types/XFilter";

const concat: IXFilterFunction<
  any[],
  any,
  IXFilterFunctionConcatOpts,
  GenericObject
> = function concat(
  payload: any,
  opts?: IXFilterFunctionConcatOpts,
  ref?: GenericObject
): any[] {
  const formattedPayload = Array.isArray(payload) ? payload : [payload];
  if (!opts?.values) return formattedPayload;

  const values = ((Array.isArray(opts.values)
    ? opts.values
    : [opts.values]) as any[]).map(v => {
    if (typeof v !== "string") return v;
    return v.startsWith("$") ? _.get(ref, v) : v;
  });

  const mergedValues = formattedPayload.concat(_.flatten(values)).filter(v => {
    if (["number", "boolean"].includes(typeof v)) return true;
    return Boolean(v);
  });
  return Array.from(new Set(mergedValues));
};

export default concat;
export interface IXFilterFunctionConcatOpts {
  values?: any | any[];
}
