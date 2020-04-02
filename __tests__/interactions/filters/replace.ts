import faker from "faker";
import _ from "lodash";

import replace from "../../../src/filters/replace";

describe("filters.replace", () => {
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
    const replacevalue = "h";

    const result = replace(
      payload,
      { hash, pattern, replacement: replacevalue },
      ref
    );

    expect(result).toBe(`${hour}${replacevalue}`);
  });

  it("should return replace value with reference", () => {
    const payload = `${_.invert(hash)[hour].toUpperCase()}${pattern}`;

    const result = replace(
      payload,
      { hash, pattern, replacement: "$context.id" },
      ref
    );
    expect(result).toBe(`${hour}${ref.$context.id}`);
  });

  it("should only replace value if reference is truthy", () => {
    const payload = `${_.invert(hash)[hour].toUpperCase()}${pattern}`;

    const result = replace(
      payload,
      { hash, pattern, replacement: "$context.name" },
      ref
    );
    expect(result).toBe(`${hour}${pattern}`);
  });

  it("should replace with normal relace value", () => {
    const payload = `${_.invert(hash)[hour].toUpperCase()}${pattern}`;
    const replacevalue = "h";

    const result = replace(
      payload,
      { hash, pattern: "(\\d+)(.*)", replacement: `$1${replacevalue}` },
      ref
    );
    expect(result).toBe(`${hour}${replacevalue}`);
  });
});
