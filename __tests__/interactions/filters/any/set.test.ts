import faker from "faker";

import set from "../../../../src/filters/any/set";

describe("any.set", () => {
  it("should override value by default", () => {
    const payload = faker.lorem.words();
    expect(set(payload)).toBeUndefined();
    expect(set(payload, {})).toBeUndefined();
  });

  it("should NOT override value if input data is truthy", () => {
    const payload = faker.lorem.words();
    expect(set(payload, { override: false })).toBe(payload);
  });

  it("should override with reference", () => {
    const payload = faker.lorem.words();
    const opts = { value: "$context.id", override: true };
    const ref = { $context: { id: faker.random.uuid() } };

    expect(set(payload, opts, ref)).toBe(ref.$context.id);
  });
});
