import { URL } from "url";

import { IXFilterFunction } from "../types/XFilter";

const getURLSearchParams: IXFilterFunction<
  any,
  any,
  IXFilterFunctionGetURLSearchParamsOpts
> = function getURLSearchParams(
  payload: any,
  opts?: IXFilterFunctionGetURLSearchParamsOpts
): any {
  if (!opts?.prop || typeof opts.prop !== "string") return payload;

  try {
    const searchParams = new URL(payload).searchParams;
    return searchParams.get(opts.prop);
  } catch {
    return payload;
  }
};

export default getURLSearchParams;
export interface IXFilterFunctionGetURLSearchParamsOpts {
  prop: string;
}
