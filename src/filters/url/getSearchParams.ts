import { URL } from "url";

import { IXFilterFunction } from "../../types/XFilter";

const getSearchParams: IXFilterFunction<
  any,
  any,
  IXFilterFunctionGetSearchParamsOpts
> = function getSearchParams(
  payload: any,
  opts?: IXFilterFunctionGetSearchParamsOpts
): any {
  if (!opts?.prop || typeof opts.prop !== "string") return payload;

  try {
    const searchParams = new URL(payload).searchParams;
    return searchParams.get(opts.prop);
  } catch {
    return payload;
  }
};

export default getSearchParams;
export interface IXFilterFunctionGetSearchParamsOpts {
  prop: string;
}
