import faker from "faker";

import concat, {
  IXFilterFunctionConcatOpts,
} from "../../../src/filters/concat";

describe("filters.concat", () => {
  it("should concat non-array payload with array values", () => {
    const ref: any = { $context: { id: faker.random.uuid() } };
    const nestedArray = [faker.lorem.word(), faker.date.past()];
    const opts: IXFilterFunctionConcatOpts = {
      values: [
        ...nestedArray,
        // should flattern array - then de-duplicate
        nestedArray,
        // should de-duplicate
        "$context.id",
        "$context.id",
        // should filter falsy ref
        "$root.id",
        // should return raw value for number and boolean
        false,
        // buth shouldd filter out other falsy value
        "",
      ],
    };

    const payload = faker.random.number();
    expect(concat(payload, opts, ref)).toEqual([
      payload,
      ...nestedArray,
      ref.$context.id,
      false,
    ]);
  });

  it("should concat array payload with value", () => {
    const ref: any = { $context: { id: faker.random.uuid() } };
    const opts: IXFilterFunctionConcatOpts = {
      values: "$context.id",
    };
    const payload = [faker.lorem.word(), faker.date.past()];

    expect(concat(payload, opts, ref)).toEqual([...payload, ref.$context.id]);
  });

  it("should concat array payload with no values", () => {
    const payload = [faker.lorem.word(), faker.date.past()];

    expect(concat(payload)).toEqual(payload);
    expect(concat(payload[0])).toEqual([payload[0]]);
  });
});
