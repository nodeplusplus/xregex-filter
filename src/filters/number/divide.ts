import _ from "lodash";

import { GenericObject } from "../../types/Common";
import { IXFilterFunction } from "../../types/XFilter";

const devide: IXFilterFunction<
  number,
  any,
  IXFilterFunctionDevideOpts,
  GenericObject
> = function devide(
  payload: any,
  opts?: IXFilterFunctionDevideOpts,
  ref?: GenericObject
): number {
  const dividend = Number(payload);
  // Converted value is NaN
  if (!Number.isFinite(dividend)) return payload;
  if (!opts?.divisor || !["string", "number"].includes(typeof opts.divisor)) {
    return payload;
  }

  const divisor = Number(opts.divisor) || Number(_.get(ref, opts.divisor));
  if (!divisor || !Number.isFinite(divisor)) return payload;

  return dividend / divisor;
};

export default devide;
export interface IXFilterFunctionDevideOpts {
  divisor?: string | number;
}
