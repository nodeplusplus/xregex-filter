import faker from "faker";
import moment from "moment";

import toUnixTime from "../../../../src/filters/datetime/toUnixTime";

describe("datetime.toUnixTime", () => {
  it("should return input data if it's not valid datetime string or object", () => {
    expect(toUnixTime()).toBeUndefined();
    expect(toUnixTime(null)).toBeNull();
    expect(toUnixTime("")).toBe("");
    expect(toUnixTime({})).toEqual({});
    expect(toUnixTime([])).toEqual([]);
  });

  it("should return unix time if payload is date object", () => {
    const payload = faker.date.past();
    expect(toUnixTime(payload)).toBe(moment(payload).unix());
  });

  it("should return payload if payload is not valid datetime string", () => {
    const payload = faker.lorem.word();
    expect(toUnixTime(payload)).toBe(payload);
  });

  it("should return payload if payload is valid datetime string but isn't matched the format", () => {
    const payload = faker.date.past().toISOString();
    const opts = { format: ["YYYY-MM-DD"] };
    expect(toUnixTime(payload, opts)).toBe(payload);
  });

  it("should return unix time", () => {
    const payload = moment(faker.date.past()).format("YYYY-MM-DD");
    const opts = { format: ["YYYY-MM-DD"] };
    expect(toUnixTime(payload, opts)).toBe(moment(payload).unix());
  });
});
