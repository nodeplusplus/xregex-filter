import faker from "faker";

import createArrayOfProp, {
  IXFilterFunctionCreateArrayOfPropOpts
} from "../../../src/filters/createArrayOfProp";

describe("filters.createArrayOfProp", () => {
  it("should return raw payload if payload is not truthy array", () => {
    expect(createArrayOfProp([])).toEqual([]);
    expect(createArrayOfProp(null)).toBeNull();
    expect(createArrayOfProp()).toBeUndefined();
  });

  it("should return raw payload if opts.prop is not provided", () => {
    const payload = faker.random.words().split(" ");

    expect(createArrayOfProp(payload)).toBe(payload);
  });

  it("should return array of propeties from array of object", () => {
    const words = faker.random.words().split(" ");
    const payload = words
      .map(word => ({ word } as any))
      // should filter falsy value as well
      .concat(null);
    const opts: IXFilterFunctionCreateArrayOfPropOpts = {
      prop: "word"
    };

    expect(createArrayOfProp(payload, opts)).toEqual(words);
  });
});
