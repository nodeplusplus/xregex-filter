import faker from "faker";

import divide from "../../../src/filters/divide";

describe("filters.divide", () => {
  it("should retrun input data if dividend is not finite number", () => {
    const payload = faker.lorem.word();
    expect(divide(payload)).toBe(payload);
  });

  it("should return input payload if opts.divisor is not valid finite number", () => {
    const payload = String(faker.random.number());
    const ref = { $context: { id: faker.random.uuid() } };

    // No opts
    expect(divide(payload)).toBe(payload);
    // opts.divisor is falsy value
    expect(divide(payload, { divisor: false as any })).toBe(payload);
    // opts.divisor is not string or number
    expect(divide(payload, { divisor: new Date() as any })).toBe(payload);
    // opts.divisor is the string cannot be converted to finite number
    expect(divide(payload, { divisor: faker.lorem.word() })).toBe(payload);
    // opts.divisor is the reference cannot be converted to finite number
    expect(divide(payload, { divisor: "$context.id" }, ref)).toBe(payload);
  });

  it("should divide successfully", () => {
    const dividend = String(faker.random.number());
    const divisor = String(faker.random.number());

    expect(divide(dividend, { divisor })).toBe(
      Number(dividend) / Number(divisor)
    );
  });
});
