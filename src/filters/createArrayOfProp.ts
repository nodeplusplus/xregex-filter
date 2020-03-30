import _ from "lodash";

import { IXFilterFunction } from "../types/XFilter";

const createArrayOfProp: IXFilterFunction<
  any[],
  any,
  IXFilterFunctionCreateArrayOfPropOpts
> = function createArrayOfProp(
  payload: any,
  opts?: IXFilterFunctionCreateArrayOfPropOpts
): any[] {
  const prop = opts?.prop;
  if (!Array.isArray(payload) || !payload.length || !prop) return payload;

  return payload.map((p) => _.get(p, prop)).filter(Boolean);
};

export default createArrayOfProp;
export interface IXFilterFunctionCreateArrayOfPropOpts {
  prop?: string;
}
