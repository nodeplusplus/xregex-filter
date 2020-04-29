import _ from "lodash";

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

  return _.template(opts.template)({ $data: payload, ...ref });
};

export default template;
export interface IXFilterFunctionTemplateOpts {
  template: string;
}
