import faker from "faker";

import match from "../../../../src/filters/string/match";

describe("string.match", () => {
  it("should return input data if opts.pattern is not provided", () => {
    const payload = faker.lorem.words();

    // No opts
    expect(match(payload)).toBe(payload);
    // No opts.pattern
    expect(match(payload, {} as any)).toBe(payload);
  });

  it("should return input data if payload is falsy", () => {
    const opts = { pattern: "\\?id=(\\d+)" };

    expect(match(undefined, opts)).toBeUndefined();
    expect(match(null, opts)).toBeNull();
    expect(match("", opts)).toBe("");
  });

  it("should return input data if no value was matched", () => {
    const id = faker.random.number();
    const payload = `https://${faker.internet.domainName()}?page=${id}`;

    expect(match(payload, { pattern: "\\?id=(\\d+)" })).toBe(payload);
  });

  it("should return matched value", () => {
    const id = faker.random.number();
    const payload = `https://${faker.internet.domainName()}?id=${id}`;

    expect(match(payload, { pattern: "\\?id=(\\d+)" })).toBe(String(id));
  });
});
