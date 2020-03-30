import moment from "moment";

import { IXFilterFunction } from "../types/XFilter";

const parseUnixTime: IXFilterFunction<string> = function parseUnixTime(
  payload: any
): string {
  const unixTime = payload && Number(payload);

  const isValidUnixTime =
    unixTime &&
    [SECOND_UNIX_TIME_LENGTH, MILLISECOND_UNIX_TIME_LENGTH].includes(
      String(unixTime).length
    );
  if (!isValidUnixTime) return payload;

  const secondsUnixTime =
    String(unixTime).length === SECOND_UNIX_TIME_LENGTH
      ? unixTime
      : Math.round(unixTime / 1000);
  return moment.unix(secondsUnixTime).toISOString();
};

export default parseUnixTime;
export const SECOND_UNIX_TIME_LENGTH = 10;
export const MILLISECOND_UNIX_TIME_LENGTH = 13;
