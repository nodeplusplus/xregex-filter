import moment from "moment";

import { IXFilterFunction } from "../types/XFilter";

const parseRelativeTime: IXFilterFunction<
  string,
  any,
  IXFilterFunctionParseRelativeTimeOpts
> = function parseRelativeTime(
  payload: any,
  opts?: IXFilterFunctionParseRelativeTimeOpts
): string {
  if (!payload || typeof payload !== "string") return payload;
  if (!opts || !opts.pattern) return payload;

  // Cleanup first
  const datetime = payload.toLowerCase().trim().replace(/\s\s+/g, " ");
  if (!datetime) return payload;

  const { pattern, unitsMap } = opts;

  const matched = datetime.match(pattern);
  if (!matched || !matched[2]) return payload;

  const time = Number(matched[1]);
  const unit = unitsMap ? unitsMap[matched[2]] : matched[2];
  if (!time || !unit) return payload;

  return moment()
    .subtract(time, unit as any)
    .toISOString();
};

export default parseRelativeTime;
export interface IXFilterFunctionParseRelativeTimeOpts {
  pattern: string;
  unitsMap?: {
    [name: string]: IXFilterParseRelativeTimeUnits;
  };
}
export type IXFilterParseRelativeTimeUnits =
  | "s"
  | "ss"
  | "m"
  | "mm"
  | "h"
  | "hh"
  | "d"
  | "dd"
  | "M"
  | "MM"
  | "y"
  | "yy";
