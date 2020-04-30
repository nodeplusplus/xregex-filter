import moment from "moment";

import { IXFilterFunction } from "../../types/XFilter";

const toUnixTime: IXFilterFunction<
  number,
  any,
  IXFilterFunctionToUnixTimeOpts
> = function toUnixTime(
  payload: any,
  opts?: IXFilterFunctionToUnixTimeOpts
): number | any {
  const isDateObject = payload instanceof Date;
  const isTruthyString = payload && typeof payload === "string";
  if (!isDateObject && !isTruthyString) return payload;

  if (payload instanceof Date) return moment(payload).unix();

  const datetime =
    opts?.format && Array.isArray(opts.format)
      ? moment(payload, opts.format, true)
      : moment(payload);
  if (!datetime.isValid()) return payload;

  return datetime.unix();
};

export default toUnixTime;
export interface IXFilterFunctionToUnixTimeOpts {
  format?: string[];
}
