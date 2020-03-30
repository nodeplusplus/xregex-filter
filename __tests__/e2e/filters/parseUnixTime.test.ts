import faker from "faker";
import moment from "moment";

import parseUnixTime from "../../../src/filters/parseUnixTime";

describe("filters.parseUnixTime", () => {
  it("should return input data if it's not valid numbers", () => {
    expect(parseUnixTime()).toBeUndefined();
    expect(parseUnixTime(null)).toBeNull();
    expect(parseUnixTime("")).toBe("");
    expect(parseUnixTime("a")).toBe("a");
  });

  it("should return input data if payload is not a number with valid length (10 or 13 numbers)", () => {
    const payload = faker.random.number();
    expect(parseUnixTime(payload)).toBe(payload);
  });

  it("should parse second time successfully", () => {
    const payload = faker.random.number({ min: 1000000000, max: 9999999999 });
    expect(parseUnixTime(payload)).toBe(moment.unix(payload).toISOString());
  });

  it("should parse millisecond time successfully", () => {
    const payload = faker.random.number({
      min: 1000000000000,
      max: 9999999999999
    });
    expect(parseUnixTime(payload)).toBe(
      moment.unix(Math.round(payload / 1000)).toISOString()
    );
  });
});
