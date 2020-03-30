import faker from "faker";
import moment from "moment";

import parseStringTime, {
  IXFilterFunctionParseStringTimeOpts
} from "../../../src/filters/parseStringTime";

describe("filters.parseStringTime", () => {
  it("should return input data if it's not valid string", () => {
    expect(parseStringTime()).toBeUndefined();
    expect(parseStringTime(null)).toBeNull();
    expect(parseStringTime("")).toBe("");
  });

  it("should return input data if opts is not valid)", () => {
    const payload = "22/01/2020 13:31";
    expect(parseStringTime(payload)).toBe(payload);
    expect(
      parseStringTime(payload, { replace: "$3-$2-$1 $4-$5:00 +07:00" } as any)
    ).toBe(payload);
    expect(
      parseStringTime(payload, {
        pattern: "(\\d+)/(\\d+)/(\\d+) (\\d+):(\\d+)"
      } as any)
    ).toBe(payload);
  });

  it("should return input data if datetime after cleanup is not valid string", () => {
    const opts: IXFilterFunctionParseStringTimeOpts = {
      pattern: "(\\d+)/(\\d+)/(\\d+) (\\d+):(\\d+)",
      replace: "$3-$2-$1 $4-$5:00 +07:00"
    };
    expect(parseStringTime("\n\n", opts)).toBe("\n\n");
    expect(parseStringTime(" ", opts)).toBe(" ");
    expect(parseStringTime("1 giờ trước", opts)).toBe("1 giờ trước");
  });

  it("should return input data if parsed datetime is falsy value", () => {
    const opts: IXFilterFunctionParseStringTimeOpts = {
      pattern: "(.*)/(.*)",
      replace: "$1$2"
    };
    const payload = " / ";

    expect(parseStringTime(payload, opts)).toBe(payload);
  });

  it("should return payload if datetime string is not valid datetime", () => {
    const payload = "invalid datetime";
    const opts: IXFilterFunctionParseStringTimeOpts = {
      pattern: "(\\d+)/(\\d+)/(\\d+) (\\d+):(\\d+)",
      replace: "$3-$2-$1 $4-$5:00 +07:00"
    };
    expect(parseStringTime(payload, opts)).toBe(payload);
  });

  it("should using format and locale", () => {
    const date = {
      year: 2020,
      month: 0 /*month is zero base*/,
      day: 22,
      hour: 13,
      minute: 31
    };
    const payload = `${date.day}/${date.month + 1}/${date.year} ${date.hour}:${
      date.minute
    }`;
    const opts: IXFilterFunctionParseStringTimeOpts = {
      pattern: "(\\d+)/(\\d+)/(\\d+) (\\d+):(\\d+)",
      replace: "$3-$2-$1 $4:$5:00 +07:00",
      format: "YYYY-M-DD HH:mm:ss Z"
    };

    const expected = moment(
      new Date(date.year, date.month, date.day, date.hour, date.minute, 0)
    );
    const received = moment(parseStringTime(payload, opts));
    // Only allow different by milliseconds
    expect(expected.diff(received)).toBeLessThan(100);
  });
});
