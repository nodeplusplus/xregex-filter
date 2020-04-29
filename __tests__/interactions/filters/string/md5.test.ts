import faker from "faker";

import md5 from "../../../../src/filters/string/md5";

describe("string.md5", () => {
  it("should return input data if payload is not valid string or number", () => {
    expect(md5()).toBeUndefined();
    expect(md5(null)).toBeNull();
    expect(md5("")).toBe("");
    const payload = faker.date.recent();
    expect(md5(payload)).toBe(payload);
  });

  it("should return md5 value", () => {
    const payload = faker.lorem.words();

    expect(md5(payload).length).toBe(32);
  });
});
