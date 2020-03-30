import faker from "faker";
import moment from "moment";

import parseDatetime, {
  IXFilterFunctionParseDatetimeOpts,
} from "../../../src/filters/parseDatetime";

describe("filters.parseDatetime", () => {
  const timezone = moment().format("Z");

  it("should return input payload if its not truthy value", () => {
    expect(parseDatetime("")).toBe("");
    expect(parseDatetime()).toBeUndefined();
    expect(parseDatetime(null)).toBeNull();
  });

  it("should return input payload if its not string ỏ number value", () => {
    expect(parseDatetime({})).toEqual({});

    const datetime = faker.date.recent();
    expect(parseDatetime(datetime)).toEqual(datetime);
  });

  it("should parse unix time successfully", () => {
    const payload = moment(faker.date.past());

    expect(payload.diff(moment(parseDatetime(payload.unix())))).toBeLessThan(
      1000 /* diff by 1s */
    );
    expect(
      payload.diff(moment(parseDatetime(String(payload.unix()))))
    ).toBeLessThan(1000 /* diff by 1s */);
  });

  it("should valid ISO Date string immediately", () => {
    const payload = faker.date.past().toISOString();

    expect(parseDatetime(payload)).toBe(payload);
  });

  it("should match datetime successfully", () => {
    const date = {
      year: 2020,
      month: 0 /*month is zero base*/,
      day: 22,
      hour: 13,
      minute: 31,
    };
    const payload = `${date.day}/${date.month + 1}/${date.year} ${date.hour}:${
      date.minute
    }`;
    const opts: IXFilterFunctionParseDatetimeOpts = {
      match: {
        pattern: "(\\d+)/(\\d+)/(\\d+) (\\d+):(\\d+)",
        replace: `$3-$2-$1 $4:$5:00 ${timezone}`,
        format: "YYYY-M-DD HH:mm:ss Z",
      },
      relative: {
        pattern: "(\\d+) (.*)",
        unitsMap: { "giờ trước": "m" },
      },
    };

    const expected = moment(
      new Date(date.year, date.month, date.day, date.hour, date.minute, 0)
    );
    const received = moment(parseDatetime(payload, opts));
    // Only allow different by milliseconds
    expect(expected.diff(received)).toBeLessThan(100);
  });

  it("should parser relative datetime successfully", () => {
    const value = faker.random.number({ min: 1, max: 12 });
    const unitKey = "giờ trước";
    const unitValue = "m";
    const payload = [value, unitKey].join(" ");

    const opts: IXFilterFunctionParseDatetimeOpts = {
      match: {
        pattern: "(\\d+)/(\\d+)/(\\d+) (\\d+):(\\d+)",
        replace: `$3-$2-$1 $4:$5:00 ${timezone}`,
        format: "YYYY-M-DD HH:mm:ss Z",
      },
      relative: {
        pattern: "(\\d+) (.*)",
        unitsMap: { [unitKey]: unitValue },
      },
    };

    const expected = moment().subtract(value, unitValue);
    const received = moment(parseDatetime(payload, opts));
    // Only allow different by milliseconds
    expect(expected.diff(received)).toBeLessThan(100);
  });

  it("should return input payload if we cannot parse to any date value", () => {
    const payload = "2 phút trước";
    const opts: IXFilterFunctionParseDatetimeOpts = {
      match: {
        pattern: "(\\d+)/(\\d+)/(\\d+) (\\d+):(\\d+)",
        replace: `$3-$2-$1 $4:$5:00 ${timezone}`,
        format: "YYYY-M-DD HH:mm:ss Z",
      },
      relative: {
        pattern: "(\\d+) (.*)",
        unitsMap: { "giờ trước": "m" },
      },
    };

    expect(parseDatetime(payload)).toBe(payload);
    expect(parseDatetime(payload, opts)).toBe(payload);
  });
});
