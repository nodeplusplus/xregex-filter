import faker from "faker";

import get from "../../../../src/filters/any/get";

describe("any.get", () => {
  it("should return input data if opts.prop is not valid string", () => {
    const payload = faker.lorem.word();

    // No opts
    expect(get(payload)).toBe(payload);
    // opts.prop is not truthy string
    expect(get(payload, { prop: new Date() } as any)).toBe(payload);
    expect(get(payload, {} as any)).toBe(payload);
    expect(get(payload, { prop: "" })).toBe(payload);
  });

  it("should return value successfully", () => {
    const payload = faker.lorem.word();
    const ref = { $context: { id: faker.random.uuid() } };

    // get input data as well
    expect(get(payload, { prop: "$data" }, ref)).toBe(payload);
    // get reference
    expect(get(payload, { prop: "$context.id" }, ref)).toBe(ref.$context.id);
  });
});
