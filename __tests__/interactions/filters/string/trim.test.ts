import faker from "faker";

import trim from "../../../../src/filters/string/trim";

describe("string.trim", () => {
  it("should return input data if it is not truthy string", () => {
    expect(trim()).toBeUndefined();
    expect(trim(null)).toBeNull();
    expect(trim("")).toBe("");
    const payload = faker.date.recent();
    expect(trim(payload)).toBe(payload);
  });

  it("should trim data successflly", () => {
    const payload = faker.random.words();
    expect(trim(`  ${payload} `)).toBe(payload);
  });
});
