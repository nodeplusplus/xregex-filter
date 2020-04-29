import faker from "faker";

import toNumber from "../../../../src/filters/any/toNumber";

describe("any.toNumber", () => {
  it("should return number if we can transform payload to number as well", () => {
    const payload = String(faker.random.number(100));
    expect(toNumber(payload)).toBe(Number(payload));
  });

  it("should return default value if transformed number is invalid", () => {
    const payload = "not-valid";
    const opts: { defaultValue: number } = {
      defaultValue: faker.random.number(100),
    };
    expect(toNumber(payload, opts)).toBe(opts.defaultValue);
  });

  it("should return ZERO if both transformed number and default value were invalid", () => {
    const payload = "not-valid";
    expect(toNumber(payload)).toBe(0);
  });

  it("should return input payload if result is not finite number", () => {
    expect(toNumber(Number.POSITIVE_INFINITY)).toBe(Number.POSITIVE_INFINITY);
    expect(toNumber(Number.NEGATIVE_INFINITY)).toBe(Number.NEGATIVE_INFINITY);
  });
});
