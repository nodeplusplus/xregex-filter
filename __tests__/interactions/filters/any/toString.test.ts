import faker from "faker";

import toString from "../../../../src/filters/any/toString";

describe("any.toString", () => {
  it("should convert payload to string successfully", () => {
    const number = faker.random.number(100);
    expect(toString(number)).toBe(String(number));

    const object = { id: faker.random.uuid() };
    expect(toString(object)).toBe(String(object));
  });
});
