import faker from "faker";
import slug from "slug";

import toSlug from "../../../../src/filters/string/toSlug";

describe("string.toSlug", () => {
  it("should retrun payload to string successfullyif it's not valid string", () => {
    const string = "";
    expect(toSlug(string)).toBe(String(string));

    const object = { id: faker.random.uuid() };
    expect(toSlug(object)).toEqual(object);
  });

  it("should return slugified string", () => {
    const payload = faker.lorem.words();
    expect(toSlug(payload)).toBe(slug(payload));
  });
});
