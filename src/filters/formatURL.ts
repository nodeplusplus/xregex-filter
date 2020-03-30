import url, { URL } from "url";

import { IXFilterFunction } from "../types/XFilter";

const formatURL: IXFilterFunction<
  string,
  any,
  IXFilterFunctionFormatURL
> = function formatURL(payload: any, opts?: IXFilterFunctionFormatURL): string {
  if (!payload || !opts?.baseURL) return payload;
  if (!["string", "number"].includes(typeof payload)) return payload;

  const hostname = url.parse(String(payload)).hostname;
  if (hostname) return payload;

  return new URL(String(payload), opts.baseURL).toString();
};

export default formatURL;
export interface IXFilterFunctionFormatURL {
  baseURL: string;
}
