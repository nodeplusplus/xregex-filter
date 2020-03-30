import faker from "faker";
import moment from "moment";

import parseStringTime, {
  IXFilterFunctionParseStringTimeOpts,
} from "../../../src/filters/parseStringTime";

describe("filters.parseStringTime", () => {
  const timezone = moment().format("Z");

  it("should return input data if it's not valid string", () => {
    expect(parseStringTime()).toBeUndefined();
    expect(parseStringTime(null)).toBeNull();
    expect(parseStringTime("")).toBe("");
  });

  it("should return input data if opts is not valid)", () => {
    const payload = "22/01/2020 13:31";
    expect(parseStringTime(payload)).toBe(payload);
    expect(
      parseStringTime(payload, {
        replace: `$3-$2-$1 $4-$5:00 ${timezone}`,
      } as any)
    ).toBe(payload);
    expect(
      parseStringTime(payload, {
        pattern: "(\\d+)/(\\d+)/(\\d+) (\\d+):(\\d+)",
      } as any)
    ).toBe(payload);
  });

  it("should return input data if datetime after cleanup is not valid string", () => {
    const opts: IXFilterFunctionParseStringTimeOpts = {
      pattern: "(\\d+)/(\\d+)/(\\d+) (\\d+):(\\d+)",
      replace: `$3-$2-$1 $4-$5:00 ${timezone}`,
    };
    expect(parseStringTime("\n\n", opts)).toBe("\n\n");
    expect(parseStringTime(" ", opts)).toBe(" ");
    expect(parseStringTime("1 giờ trước", opts)).toBe("1 giờ trước");
  });

  it("should return input data if parsed datetime is falsy value", () => {
    const opts: IXFilterFunctionParseStringTimeOpts = {
      pattern: "(.*)/(.*)",
      replace: "$1$2",
    };
    const payload = " / ";

    expect(parseStringTime(payload, opts)).toBe(payload);
  });

  it("should return payload if datetime string is not valid datetime", () => {
    const payload = "invalid datetime";
    const opts: IXFilterFunctionParseStringTimeOpts = {
      pattern: "(\\d+)/(\\d+)/(\\d+) (\\d+):(\\d+)",
      replace: `$3-$2-$1 $4-$5:00 ${timezone}`,
    };
    expect(parseStringTime(payload, opts)).toBe(payload);
  });

  it("should using format and locale", () => {
    const date = faker.date.recent();
    const dateProps = {
      date: String(date.getDate()).padStart(2, "0"),
      month: String(date.getMonth() + 1),
      year: String(date.getFullYear()),
      hours: String(date.getHours()).padStart(2, "0"),
      minutes: String(date.getMinutes()).padStart(2, "0"),
    };
    const payload = `${dateProps.date}/${dateProps.month}/${dateProps.year} ${dateProps.hours}:${dateProps.minutes}`;
    const opts: IXFilterFunctionParseStringTimeOpts = {
      pattern: "(\\d+)/(\\d+)/(\\d+) (\\d+):(\\d+)",
      replace: `$3-$2-$1 $4:$5:00 ${timezone}`,
      format: ["YYYY-MM-DD HH:mm:ss Z", "YYYY-M-DD HH:mm:ss Z"],
    };

    const expected = moment(date);
    const received = moment(parseStringTime(payload, opts));
    // Only allow different by minutes
    expect(expected.diff(received)).toBeLessThan(100000);
  });
});
