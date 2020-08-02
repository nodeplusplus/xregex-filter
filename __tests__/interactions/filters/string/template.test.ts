import faker from "faker";

import template from "../../../../src/filters/string/template";

describe("string.template", () => {
  it("should return input data if template string is not provided", () => {
    const payload = faker.lorem.words();

    expect(template(payload)).toBe(payload);
    expect(template(payload, {} as any)).toBe(payload);
  });

  it("should return string with template", () => {
    const payload = faker.random.number();
    const ref: any = { $context: { payload: { id: faker.random.uuid() } } };
    const url = `htps://${faker.internet.domainName()}`;
    const opts = {
      template: `${url}/{{$context.payload.id}}/{{$data}}`,
    };

    expect(template(payload, opts, ref)).toBe(
      `${url}/${ref.$context.payload.id}/${payload}`
    );
  });
});
