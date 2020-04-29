import faker from "faker";

import getSearchParams from "../../../../src/filters/url/getSearchParams";

describe("url.getSearchParams", () => {
  it("should return input data if opts.prop is not valid string", () => {
    const payload = faker.lorem.word();

    // No opts
    expect(getSearchParams(payload)).toBe(payload);
    // No opts.prop
    expect(getSearchParams(payload, {} as any)).toBe(payload);
    // opts.prop is not valid string
    expect(getSearchParams(payload, { prop: "" })).toBe(payload);
    expect(getSearchParams(payload, { prop: new Date() } as any)).toBe(payload);
  });

  it("should return input data if payload is not valid url", () => {
    const payload = faker.lorem.word();
    expect(getSearchParams(payload, { prop: "non-exist" })).toBe(payload);
  });

  it("should return search param successfully", () => {
    const page = faker.random.number();
    const token = faker.random.alphaNumeric(32);
    const payload = `https://${faker.internet.domainName()}?page=${page}&token=${token}`;

    expect(getSearchParams(payload, { prop: "page" })).toBe(String(page));
    expect(getSearchParams(payload, { prop: "token" })).toBe(token);
  });
});
