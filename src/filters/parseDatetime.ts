import moment from "moment";

import { IXFilterFunction } from "../types/XFilter";

import parseUnixTime from "./parseUnixTime";
import parseStringTime, {
  IXFilterFunctionParseStringTimeOpts,
} from "./parseStringTime";
import parseRelativeTime, {
  IXFilterFunctionParseRelativeTimeOpts,
} from "./parseRelativeTime";

const parseDatetime: IXFilterFunction<
  string,
  any,
  IXFilterFunctionParseDatetimeOpts
> = function parseDatetime(
  payload: any,
  opts?: IXFilterFunctionParseDatetimeOpts
): string {
  if (!payload) return payload;
  if (!["string", "number"].includes(typeof payload)) return payload;

  if (Number(payload) && Number.isInteger(Number(payload))) {
    return parseUnixTime(payload);
  }

  // Only accept ISO string as valid datetime
  const validDatetime = moment(payload, moment.ISO_8601);
  if (validDatetime.isValid()) return validDatetime.toISOString();

  if (opts?.match) {
    let matchedDatetime = parseStringTime(String(payload), opts.match);
    // Only valid when we didn't return input data
    if (matchedDatetime !== String(payload)) return matchedDatetime;
  }

  if (opts?.relative) {
    let relativeDatetime = parseRelativeTime(String(payload), opts.relative);
    // Only valid when we didn't return input data
    if (relativeDatetime !== String(payload)) return relativeDatetime;
  }

  return payload;
};

export default parseDatetime;
export interface IXFilterFunctionParseDatetimeOpts {
  match?: IXFilterFunctionParseStringTimeOpts;
  relative?: IXFilterFunctionParseRelativeTimeOpts;
}
