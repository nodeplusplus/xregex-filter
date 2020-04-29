import { IXFilterFunction } from "../../types/XFilter";

const match: IXFilterFunction<
  string,
  any,
  IXFilterFunctionMatchOpts
> = function match(payload: any, opts?: IXFilterFunctionMatchOpts): string {
  if (!opts?.pattern) return payload;
  if (!payload) return payload;

  const [, matched] = String(payload).match(new RegExp(opts.pattern)) || [];
  return matched || payload;
};

export default match;
export interface IXFilterFunctionMatchOpts {
  pattern: string;
}
