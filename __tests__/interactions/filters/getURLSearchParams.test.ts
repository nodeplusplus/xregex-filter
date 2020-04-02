import faker from "faker";

import getURLSearchParams from "../../../src/filters/getURLSearchParams";

describe("filters.getURLSearchParams", () => {
  it("should return input data if opts.prop is not valid string", () => {
    const payload = faker.lorem.word();

    // No opts
    expect(getURLSearchParams(payload)).toBe(payload);
    // No opts.prop
    expect(getURLSearchParams(payload, {} as any)).toBe(payload);
    // opts.prop is not valid string
    expect(getURLSearchParams(payload, { prop: "" })).toBe(payload);
    expect(getURLSearchParams(payload, { prop: new Date() } as any)).toBe(
      payload
    );
  });

  it("should return input data if payload is not valid url", () => {
    const payload = faker.lorem.word();
    expect(getURLSearchParams(payload, { prop: "non-exist" })).toBe(payload);
  });

  it("should return search param successfully", () => {
    const page = faker.random.number();
    const token = faker.random.alphaNumeric(32);
    const payload = `https://${faker.internet.domainName()}?page=${page}&token=${token}`;

    expect(getURLSearchParams(payload, { prop: "page" })).toBe(String(page));
    expect(getURLSearchParams(payload, { prop: "token" })).toBe(token);
  });
});
