import path from "path";
import _ from "lodash";
import faker from "faker";
import { Container } from "inversify";
import {
  ILogger,
  createSilent as createLogger,
} from "@nodeplusplus/xregex-logger";

import XFilter, { IXFilter, ISettings, IXFilterExecOpts } from "../../src";

describe("XFilter", () => {
  const settings: ISettings = {
    directories: [path.resolve(__dirname, "../../mocks/filters")],
  };

  const container = new Container();
  let xFilter: IXFilter;
  beforeAll(async () => {
    container.bind<ISettings>("XFILTER.SETTINGS").toConstantValue(settings);
    container.bind<ILogger>("LOGGER").toConstantValue(createLogger());

    xFilter = container.resolve<IXFilter>(XFilter);
    await xFilter.start();
  });
  afterAll(async () => {
    await xFilter.stop();
  });

  describe("start/stop", () => {
    it("should start with both buit-in and custom filters", () => {
      const filtersIds = Object.keys(xFilter.filters);
      const customFilterids = filtersIds.filter((id) => id.startsWith("test"));
      expect(customFilterids.length).toBeTruthy();
    });

    it("should only start with buit-in filters", async () => {
      container.rebind<ISettings>("XFILTER.SETTINGS").toConstantValue({});

      const _xFilter = container.resolve<IXFilter>(XFilter);
      await _xFilter.start();

      const filtersIds = Object.keys(_xFilter.filters);
      const customFilterids = filtersIds.filter((id) => id.startsWith("test"));
      expect(customFilterids.length).toBeFalsy();

      await _xFilter.stop();
    });
  });

  describe("call", () => {
    it("should return input data if filter id is not found", async () => {
      const nonExistFilterId = "test.nonExistFilterId";
      const payload = { url: faker.internet.url() };

      const result = await xFilter.call(nonExistFilterId, payload);
      expect(result).toEqual(payload);
    });

    it("should call filter by their id", async () => {
      const payload = faker.internet.url();
      const opts = { baseURL: faker.internet.domainName() };
      const ref = { $now: faker.date.recent() };

      const response = await xFilter.call("test.ping", payload, opts, ref);
      expect(response).toBe("pong");
    });
  });

  describe("exec", () => {
    interface IDataItem {
      id?: string;
      url?: string;
      likes?: number | string;
      shares?: number | string;
      comments?: number | string;
      child?: IDataItem;
      childs?: IDataItem[];
    }
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
      expect(await xFilter.exec(data, opts)).toEqual(data);
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

      await xFilter
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

      const results = await xFilter.exec(data, opts);
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

      const [first] = await xFilter.exec<IDataItem>(data, optsWithChildSchema);

      expect(first).toBeTruthy();
      // Make sure props were not touched
      expect(first.id).toBe(data[0].id);
      expect(first.url).toBe(data[0].url);

      expect(first.child?.id).toBe(data[0]?.child?.id);
      // Make sure url was touched
      expect(first.child?.url).not.toBe(data[0]?.child?.url);
    });

    it("should filter flattern items successfully", async () => {
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

      const [first, last] = await xFilter.exec<IDataItem>(data, opts);

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

      const [first, last] = await xFilter.exec<IDataItem>(
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
