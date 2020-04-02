import faker from "faker";
import moment from "moment";

import parseRelativeTime, {
  IXFilterFunctionParseRelativeTimeOpts,
} from "../../../src/filters/parseRelativeTime";

describe("filters.parseRelativeTime", () => {
  it("should return input data if it's not valid string", () => {
    expect(parseRelativeTime()).toBeUndefined();
    expect(parseRelativeTime(null)).toBeNull();
    expect(parseRelativeTime("")).toBe("");
  });

  it("should return input data if pattern is not provided)", () => {
    const payload = "2 giờ trước";
    expect(parseRelativeTime(payload)).toBe(payload);
    expect(
      parseRelativeTime(payload, { unitsMap: { "giờ trước": "h" } } as any)
    ).toBe(payload);
  });

  it("should return input data if datetime after cleanup is not valid string", () => {
    const otps: IXFilterFunctionParseRelativeTimeOpts = {
      pattern: "(\\d+) (.*)",
    };
    expect(parseRelativeTime("\n\n", otps)).toBe("\n\n");
    expect(parseRelativeTime(" ", otps)).toBe(" ");
  });

  it("should return input data if string is not matched", () => {
    const payload = "2 giờ trước";

    // Didn't match anything
    expect(parseRelativeTime(payload, { pattern: "(\\w+) (\\d+)" })).toBe(
      payload
    );
    // Only match 1 segment
    expect(parseRelativeTime(payload, { pattern: "(\\d+)" })).toBe(payload);
  });

  it("should return input data if time is not valid number", () => {
    // First segment is not valid number
    expect(parseRelativeTime("hai giờ trước", { pattern: "(\\w+) (.*)" })).toBe(
      "hai giờ trước"
    );
    // Unit is not valid
    expect(parseRelativeTime("hai ", { pattern: "(\\w+) (.*)" })).toBe("hai ");
    // Or not exist in unit map
    expect(
      parseRelativeTime("hai giờ trước", {
        pattern: "(\\w+) (.*)",
        unitsMap: {
          "phút trước": "m",
        },
      })
    ).toBe("hai giờ trước");
  });

  it("should parse relative time successfully", () => {
    const value = faker.random.number({ min: 1, max: 12 });
    const unitsMap: any = {
      "giờ trước": "m",
    };

    for (let hash of Object.keys(unitsMap)) {
      const payload = [value, hash].join(" ");
      const opts: IXFilterFunctionParseRelativeTimeOpts = {
        pattern: "(\\d+) (.*)",
        unitsMap,
      };

      const expected = moment().subtract(value, unitsMap[hash]);
      const received = moment(parseRelativeTime(payload, opts));
      // Only allow different by milliseconds
      expect(expected.diff(received)).toBeLessThan(100);
    }
  });
});
