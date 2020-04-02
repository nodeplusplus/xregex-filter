import faker from "faker";

import JSONParse from "../../../src/filters/JSONParse";

describe("filters.JSONParse", () => {
  it("should return input data if it is not valid string", () => {
    expect(JSONParse()).toBeUndefined();
    expect(JSONParse(null)).toBeNull();
    const payload = faker.date.recent();
    expect(JSONParse(payload)).toBe(payload);
  });

  it("should return input data if it is not valid json string", () => {
    const payload = faker.lorem.words();
    expect(JSONParse(payload)).toBe(payload);
  });

  it("should return object from json string", () => {
    const payload = {
      id: faker.random.uuid(),
      priority: faker.random.number(),
    };

    expect(JSONParse(JSON.stringify(payload))).toEqual(payload);
  });
});
