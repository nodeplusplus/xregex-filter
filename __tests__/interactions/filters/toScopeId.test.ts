import faker from "faker";

import toScopeId, { DEFAULT_SEPERATOR } from "../../../src/filters/toScopeId";

describe("filters.toScopeId", () => {
  it("should return input data if opts.prop or payload are not truthy", () => {
    expect(toScopeId()).toBeUndefined();
    expect(toScopeId(null)).toBeNull();
    expect(toScopeId("")).toBe("");

    // No opts
    expect(toScopeId(faker.random.number()));
    // No opts.prop
    expect(toScopeId(faker.random.number(), {} as any));
  });

  it("should return input data if payload is not string or number", () => {
    const payload = faker.date.recent();
    expect(toScopeId(payload, { prop: faker.random.uuid() })).toEqual(payload);
  });

  it("should generate scope id with valid opts.prop", () => {
    const payload = faker.random.number();
    const prop = faker.random.number();
    const ref = { $context: { payload: { id: faker.random.uuid() } } };

    // opts.prop is raw value
    expect(toScopeId(payload, { prop }, ref)).toBe(
      `${prop}${DEFAULT_SEPERATOR}${payload}`
    );
    // opts.prop is reference
    expect(toScopeId(payload, { prop: "$context.payload.id" }, ref)).toBe(
      `${ref.$context.payload.id}${DEFAULT_SEPERATOR}${payload}`
    );
  });

  it("should always using last segment of scope id to generate new scope id", () => {
    const seperator = ":";
    const payload = [faker.random.uuid(), faker.random.number()];
    const prop = [faker.random.uuid(), faker.random.uuid()];
    const ref = { $context: { payload: { id: faker.random.uuid() } } };

    expect(
      toScopeId(
        payload.join(seperator),
        { prop: prop.join(seperator), seperator },
        ref
      )
    ).toBe(`${prop[1]}${seperator}${payload[1]}`);
  });
});
