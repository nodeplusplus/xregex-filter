import faker from "faker";

import format from "../../../../src/filters/url/format";

describe("url.format", () => {
  it("should return input data if opts.prop or payload are not truthy", () => {
    expect(format()).toBeUndefined();
    expect(format(null)).toBeNull();
    expect(format("")).toBe("");

    // No opts
    expect(format(faker.random.number()));
    // No opts.prop
    expect(format(faker.random.number(), {} as any));
  });

  it("should return input data if payload is not string or number", () => {
    const payload = faker.date.recent();
    expect(
      format(payload, { baseURL: `https://${faker.internet.domainName()}` })
    ).toEqual(payload);
  });

  it("should return input payload if payload is already valid url", () => {
    const payload = faker.internet.url();
    expect(format(payload, { baseURL: faker.random.word() })).toEqual(payload);
  });

  it("should return formatted url", () => {
    const payload = faker.random.number();
    const baseURL = `https://${faker.internet.domainName()}`;

    expect(format(payload, { baseURL })).toEqual([baseURL, payload].join("/"));
  });
});
