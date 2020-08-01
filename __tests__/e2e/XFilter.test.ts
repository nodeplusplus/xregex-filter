import path from "path";
import _ from "lodash";
import faker from "faker";
import { LoggerType } from "@nodeplusplus/xregex-logger";

import {
  IXFilterExecOpts,
  ITemplate,
  Builder,
  Director,
  IXFilter,
} from "../../src";

describe("XFilter", () => {
  describe("start/stop", () => {
    const template: ITemplate = {
      logger: { type: LoggerType.SILENT },
      XFilter: {
        directories: [path.resolve(__dirname, "../../mocks/filters")],
      },
    };
    const builder = new Builder();

    it("should start/stop with custom directories successful", async () => {
      new Director().constructFromTemplate(builder, template);
      const xfilter = builder.getXFilter();

      await xfilter.start();
      const customFilters = Object.keys(xfilter.filters).filter((id) =>
        id.startsWith("test")
      );
      expect(customFilters.length).toBeGreaterThanOrEqual(1);

      await xfilter.stop();
      expect(xfilter.filters).toBeUndefined();
    });

    it("should start/stop with default filters as well", async () => {
      new Director().constructFromTemplate(
        builder,
        _.omit(template, "XFilter")
      );
      const xfilter = builder.getXFilter();

      expect(builder.getContainer().isBound("XFILTER.DIRECTORIES")).toBeFalsy();

      await xfilter.start();
      expect(
        Object.keys(xfilter.filters).some((id) => id.startsWith("test"))
      ).toBeFalsy();

      await xfilter.stop();
      expect(xfilter.filters).toBeUndefined();
    });
  });

  describe("call", () => {
    const template: ITemplate = {
      logger: { type: LoggerType.SILENT },
      XFilter: {
        directories: [path.resolve(__dirname, "../../mocks/filters")],
      },
    };

    let xfilter: IXFilter;
    const builder = new Builder();
    beforeAll(async () => {
      new Director().constructFromTemplate(builder, template);
      xfilter = builder.getXFilter();
      await xfilter.start();
    });
    afterAll(async () => {
      await xfilter.stop();
    });

    it("should return original payload if id was not found", async () => {
      const xfilter = builder.getXFilter();

      const id = faker.random.uuid();
      const payload = { id: faker.random.uuid() };

      expect(await xfilter.call(id, payload)).toEqual(payload);
    });

    it("should return result of filter", async () => {
      const xfilter = builder.getXFilter();

      const id = "test.ping";
      const payload = { id: faker.random.uuid() };
      const options = { name: faker.lorem.word() };
      const ref = { url: faker.internet.url() };

      const result = await xfilter.call(id, payload, options, ref);

      expect(result).toEqual({
        payload,
        options,
        ref,
        message: "pong",
      });
    });
  });
  describe("exec", () => {
    const template: ITemplate = {
      logger: { type: LoggerType.SILENT },
      XFilter: {
        directories: [path.resolve(__dirname, "../../mocks/filters")],
      },
    };

    let xfilter: IXFilter;
    const builder = new Builder();
    beforeAll(async () => {
      new Director().constructFromTemplate(builder, template);
      xfilter = builder.getXFilter();
      await xfilter.start();
    });
    afterAll(async () => {
      await xfilter.stop();
    });

    const baseURL = `http://${faker.internet.domainName()}`;
    const opts: IXFilterExecOpts = {
      schema: {
        url: [
          { id: "string.trim", priority: 10 },
          { id: "url.format", priority: 1, opts: { baseURL } },
        ],
        likes: [{ id: "any.toNumber", priority: 1 }],
        shares: [{ id: "any.toNumber", priority: 1 }],
        comments: [{ id: "any.set", priority: 1, opts: { value: 1 } }],
      },
    };

    it("should return input data if that is not array", async () => {
      const data = { content: faker.lorem.paragraph() } as any;
      const opts = {} as any;
      expect(await xfilter.exec(data, opts)).toEqual(data);
    });

    it("should thorw error if schema is not defined", async () => {
      const data = [
        {
          id: faker.random.uuid(),
          url: faker.random.uuid(),
          likes: String(faker.random.number(100)),
        },
      ];
      const opts = {} as any;

      await xfilter
        .exec(data, opts)
        .catch((error: Error) =>
          expect(error.message).toEqual(expect.stringContaining("NO_SCHEMA"))
        );
    });

    it("should only use valid filters", async () => {
      const data = [{ id: faker.random.uuid(), url: faker.random.uuid() }];
      const opts: any = {
        schema: {
          // witth no id
          id: [{ priority: 1 }],
          // with no priority
          url: [{ id: "url.format" }],
          // with no id
          shares: [null],
        },
      };

      const results = await xfilter.exec(data, opts);
      expect(results).toEqual(data);
    });

    it("should return only filter what schema defined", async () => {
      const data: IDataItem[] = [
        {
          id: faker.random.uuid(),
          url: faker.random.uuid(),
          child: {
            id: faker.random.uuid(),
            url: faker.random.uuid(),
          },
        },
      ];

      const optsWithChildSchema: IXFilterExecOpts = {
        schema: {
          child: opts.schema,
        },
      };

      const [first] = await xfilter.exec<IDataItem>(data, optsWithChildSchema);

      expect(first).toBeTruthy();
      // Make sure props were not touched
      expect(first.id).toBe(data[0].id);
      expect(first.url).toBe(data[0].url);

      expect(first.child?.id).toBe(data[0]?.child?.id);
      // Make sure url was touched
      expect(first.child?.url).not.toBe(data[0]?.child?.url);
    });

    it("should filter items successfully", async () => {
      const data: IDataItem[] = [
        {
          id: faker.random.uuid(),
          url: faker.random.uuid(),
          likes: String(faker.random.number(100)),
        },
        {
          id: faker.random.uuid(),
          url: faker.random.uuid(),
          shares: faker.random.number(100),
        },
      ];

      const [first, last] = await xfilter.exec<IDataItem>(data, opts);

      expect(first).toBeTruthy();
      expect(first.id).toBeTruthy();
      expect(first.url && first.url.includes(baseURL)).toBeTruthy();
      expect(first.likes).toBe(Number(data[0].likes));
      expect(first.shares).toBeFalsy();
      // We called non-exist filter for this field, it should be undefined
      expect(first.comments).toBe(1);

      expect(last).toBeTruthy();
      expect(last.id).toBeTruthy();
      expect(last.url && last.url.includes(baseURL)).toBeTruthy();
      expect(last.likes).toBeFalsy();
      expect(last.shares).toBe(Number(data[1].shares));
      // We called non-exist filter for this field, it should be undefined
      expect(last.comments).toBe(1);
    });

    it("should filter items with childs successfully", async () => {
      const data: IDataItem[] = [
        {
          id: faker.random.uuid(),
          url: faker.random.uuid(),
          likes: String(faker.random.number(100)),
          childs: [
            {
              id: faker.random.uuid(),
              url: faker.random.uuid(),
              likes: String(faker.random.number(100)),
            },
            {
              id: faker.random.uuid(),
              url: faker.random.uuid(),
              shares: faker.random.number(100),
            },
          ],
        },
        {
          id: faker.random.uuid(),
          url: faker.random.uuid(),
          shares: faker.random.number(100),
        },
      ];

      const optsWithChildSchema: IXFilterExecOpts = {
        schema: {
          ...opts.schema,
          childs: opts.schema,
        },
      };

      const [first, last] = await xfilter.exec<IDataItem>(
        data,
        optsWithChildSchema
      );

      // First item should be filter successfully
      expect(first).toBeTruthy();

      // Childs of first item should be filter to array of child items
      expect(first.childs && Array.isArray(first.childs)).toBeTruthy();
      const [firstChild, lastChild] = first.childs as IDataItem[];

      // Validate first child of first item was filtered successfully
      expect(firstChild).toBeTruthy();
      expect(firstChild.id).toBeTruthy();
      expect(firstChild.url && firstChild.url.includes(baseURL)).toBeTruthy();
      expect(firstChild.likes).toBe(Number((data[0] as any).childs[0].likes));
      expect(firstChild.shares).toBeFalsy();
      expect(firstChild.comments).toBe(1);

      // Also validate last child of first item
      expect(lastChild).toBeTruthy();
      expect(lastChild.url && lastChild.url.includes(baseURL)).toBeTruthy();
      expect(lastChild.likes).toBeFalsy();
      expect(lastChild.shares).toBe(Number((data[0] as any).childs[1].shares));
      expect(lastChild.comments).toBe(1);

      expect(last).toBeTruthy();
    });
  });
});

interface IDataItem {
  id?: string;
  url?: string;
  likes?: number | string;
  shares?: number | string;
  comments?: number | string;
  child?: IDataItem;
  childs?: IDataItem[];
}
