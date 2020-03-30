import _ from "lodash";

import { GenericObject } from "../types/Common";
import { IXFilterFunction } from "../types/XFilter";

const get: IXFilterFunction<
  any,
  any,
  IXFilterFunctionGetOpts,
  GenericObject
> = function get(
  payload: any,
  opts?: IXFilterFunctionGetOpts,
  ref?: GenericObject
): any {
  if (!opts?.prop || typeof opts.prop !== "string") return payload;

  return _.get({ $data: payload, ...ref }, opts.prop);
};

export default get;
export interface IXFilterFunctionGetOpts {
  prop: string;
}
