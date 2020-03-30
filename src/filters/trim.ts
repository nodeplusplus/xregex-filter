import { IXFilterFunction } from "../types/XFilter";

const trim: IXFilterFunction<
  string,
  any,
  IXFilterFunctionTrimOpts
> = function trim(payload: any, opts?: IXFilterFunctionTrimOpts): string {
  if (!payload || typeof payload !== "string") return payload;

  return payload.trim();
};

export default trim;
export interface IXFilterFunctionTrimOpts {
  force: boolean;
}
