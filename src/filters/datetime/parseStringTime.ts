import moment from "moment";

import { IXFilterFunction } from "../../types/XFilter";

const parseStringTime: IXFilterFunction<
  string,
  any,
  IXFilterFunctionParseStringTimeOpts
> = function parseStringTime(
  payload: any,
  opts?: IXFilterFunctionParseStringTimeOpts
): string {
  if (!payload || typeof payload !== "string") return payload;
  if (!opts || !opts.pattern || !opts.replace) return payload;

  // Cleanup first
  const datetime = payload.toLowerCase().trim().replace(/\s\s+/g, " ");
  if (!datetime) return payload;

  const { pattern, replace, format, locale } = opts;

  let parsedDatetime = datetime.replace(new RegExp(pattern), replace).trim();
  if (!parsedDatetime) return payload;

  const datetimeString: string = format
    ? moment(parsedDatetime, format, locale, true).toISOString()
    : parsedDatetime;
  if (!moment(datetimeString).isValid()) return payload;

  return moment(datetimeString).toISOString();
};

export default parseStringTime;
export interface IXFilterFunctionParseStringTimeOpts {
  pattern: string;
  replace: string;
  format?: string | string[];
  locale?: string;
}
