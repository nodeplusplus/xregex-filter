import { render } from "mustache";

import { IXFilterFunction } from "../../types/XFilter";

const template: IXFilterFunction<
  string,
  any,
  IXFilterFunctionTemplateOpts
> = function template(
  payload: any,
  opts?: IXFilterFunctionTemplateOpts,
  ref?: any
): string {
  if (!opts?.template) return payload;

  return render(opts.template, { $data: payload, ...ref });
};

export default template;
export interface IXFilterFunctionTemplateOpts {
  template: string;
}
