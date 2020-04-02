import faker from "faker";

import formatURL from "../../../src/filters/formatURL";

describe("filters.formatURL", () => {
  it("should return input data if opts.prop or payload are not truthy", () => {
    expect(formatURL()).toBeUndefined();
    expect(formatURL(null)).toBeNull();
    expect(formatURL("")).toBe("");

    // No opts
    expect(formatURL(faker.random.number()));
    // No opts.prop
    expect(formatURL(faker.random.number(), {} as any));
  });

  it("should return input data if payload is not string or number", () => {
    const payload = faker.date.recent();
    expect(
      formatURL(payload, { baseURL: `https://${faker.internet.domainName()}` })
    ).toEqual(payload);
  });

  it("should return input payload if payload is already valid url", () => {
    const payload = faker.internet.url();
    expect(formatURL(payload, { baseURL: faker.random.word() })).toEqual(
      payload
    );
  });

  it("should return formatted url", () => {
    const payload = faker.random.number();
    const baseURL = `https://${faker.internet.domainName()}`;

    expect(formatURL(payload, { baseURL })).toEqual(
      [baseURL, payload].join("/")
    );
  });
});
