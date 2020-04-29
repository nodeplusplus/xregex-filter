import faker from "faker";

import parse from "../../../../src/filters/json/parse";

describe("json.parse", () => {
  it("should return input data if it is not valid string", () => {
    expect(parse()).toBeUndefined();
    expect(parse(null)).toBeNull();
    const payload = faker.date.recent();
    expect(parse(payload)).toBe(payload);
  });

  it("should return input data if it is not valid json string", () => {
    const payload = faker.lorem.words();
    expect(parse(payload)).toBe(payload);
  });

  it("should return object from json string", () => {
    const payload = {
      id: faker.random.uuid(),
      priority: faker.random.number(),
    };

    expect(parse(JSON.stringify(payload))).toEqual(payload);
  });
});
