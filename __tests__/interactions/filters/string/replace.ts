import faker from "faker";
import _ from "lodash";

import replace from "../../../../src/filters/string/replace";

describe("string.replace", () => {
  const hour = faker.random.number({ min: 1, max: 12 });
  const hash = {
    một: "1",
    hai: "2",
    ba: "3",
    bốn: "4",
    năm: "5",
    sáu: "6",
    bảy: "7",
    tám: "8",
    chín: "9",
    mười: "10",
    "mười một": "11",
    "mười hai": "12",
  };
  const pattern = ` giờ trước`;
  const ref = { $context: { id: faker.random.uuid() } };

  it("should return input data if it's not truthy string or number", () => {
    expect(replace()).toBeUndefined();
    expect(replace(null)).toBeNull();
    expect(replace("")).toBe("");
    const payload = faker.date.recent();
    expect(replace(payload)).toBe(payload);
  });

  it("should not touch input data if both hash and pattern is not truthy", () => {
    const payload = `${_.invert(hash)[hour].toUpperCase()}${pattern}`;

    expect(replace(payload, { toLowser: false }, ref)).toBe(payload);
  });

  it("should replace with both hash and pattern", () => {
    const payload = `${_.invert(hash)[hour].toUpperCase()}${pattern}`;
    const replaceValue = "h";

    const result = replace(
      payload,
      { hash, pattern, value: replaceValue },
      ref
    );

    expect(result).toBe(`${hour}${replaceValue}`);
  });

  it("should return replace value with reference", () => {
    const payload = `${_.invert(hash)[hour].toUpperCase()}${pattern}`;

    const result = replace(
      payload,
      { hash, pattern, value: "$context.id" },
      ref
    );
    expect(result).toBe(`${hour}${ref.$context.id}`);
  });

  it("should only replace value if reference is truthy", () => {
    const payload = `${_.invert(hash)[hour].toUpperCase()}${pattern}`;

    const result = replace(
      payload,
      { hash, pattern, value: "$context.name" },
      ref
    );
    expect(result).toBe(`${hour}${pattern}`);
  });

  it("should replace with normal relace value", () => {
    const payload = `${_.invert(hash)[hour].toUpperCase()}${pattern}`;
    const replaceValue = "h";

    const result = replace(
      payload,
      { hash, pattern: "(\\d+)(.*)", value: `$1${replaceValue}` },
      ref
    );
    expect(result).toBe(`${hour}${replaceValue}`);
  });

  it("should replace with pattern flags as well", () => {
    const payload = "\n\n\n";
    const replaceValue = "\n";

    const result = replace(
      payload,
      { hash, pattern: "\\n\\s*\\n", patternFlags: "g", value: replaceValue },
      ref
    );

    expect(result).toBe("\n");
  });
});
