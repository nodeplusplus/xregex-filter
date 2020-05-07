import faker from "faker";

import include from "../../../../src/filters/condition/include";

describe("condition.include", () => {
  it("should return input data if it is not string or array", () => {
    expect(include()).toBeUndefined();
    expect(include(null)).toBeNull();
    const payload = faker.date.recent();
    expect(include(payload)).toBe(payload);
  });

  it("should return input data if opts.values or opts.set is not defined", () => {
    const payload = faker.lorem.words();
    expect(include(payload)).toBe(payload);
    expect(include(payload, { values: [faker.lorem.word()] } as any)).toBe(
      payload
    );
    expect(include(payload, { set: true } as any)).toBe(payload);
  });

  it("should return input data if payload is not include all item in field values", () => {
    // with string
    const string = faker.lorem.words();
    expect(
      include(string, { values: [faker.random.alphaNumeric()], set: true })
    ).toBe(string);

    // with array
    const array = faker.lorem.words().split(" ");
    expect(
      include(array, { values: [faker.random.alphaNumeric()], set: true })
    ).toBe(array);
  });

  it("should resolve reference exist in field values", () => {
    const ref = { $context: { id: faker.random.uuid() } };
    const payload = [faker.lorem.word(), faker.lorem.word(), ref.$context.id];
    const opts = { values: "$context.id", set: true };

    expect(include(payload, opts, ref)).toBe(true);
  });

  it("should resolve reference exist in field set", () => {
    const ref = { $context: { id: faker.random.uuid() } };
    const payload = [
      faker.lorem.word(),
      faker.lorem.word(),
      faker.random.alphaNumeric(),
    ];
    const opts = { values: [payload[0], payload[1]], set: "$context.id" };

    // with ref
    expect(include(payload, opts, ref)).toBe(ref.$context.id);
    // without ref
    const set = faker.internet.domainName();
    expect(include(payload, { ...opts, set }, ref)).toBe(set);
  });

  it("should return set value if it is not string", () => {
    const ref = { $context: { id: faker.random.uuid() } };
    const payload = [
      faker.lorem.word(),
      faker.lorem.word(),
      faker.random.alphaNumeric(),
    ];
    const opts = { values: [payload[0], payload[1]], set: new Date() };

    expect(include(payload, opts, ref)).toEqual(opts.set);
  });
});
