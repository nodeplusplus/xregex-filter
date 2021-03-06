import path from "path";
import _ from "lodash";
import { injectable, inject, optional } from "inversify";
import { ILogger } from "@nodeplusplus/xregex-logger";

import { GenericObject } from "./types/Common";
import {
  IXFilterOptions,
  IXFilter,
  IXFilterExecOpts,
  IXFilterOptionsFilters,
  IXFilterSchema,
  IXFilterSchemaItem,
} from "./types/XFilter";
import { Loader } from "./Loader";

@injectable()
export class XFilter implements IXFilter {
  @inject("LOGGER") private logger!: ILogger;

  private loader: Loader;
  public filters!: IXFilterOptionsFilters;

  constructor(
    @inject("XFILTER.DIRECTORIES") @optional() directories?: string[]
  ) {
    this.loader = new Loader();
    this.loader.add(path.resolve(__dirname, "filters"));
    if (Array.isArray(directories)) this.loader.add(...directories);
  }

  public async start() {
    const filters = await this.loader.run();
    this.filters = Object.freeze(filters);

    this.logger.info("XFILTER:STARTED", { filters: Object.keys(this.filters) });
  }

  public async stop() {
    this.logger.info("XFILTER:STOPPED");
    this.filters = undefined as any;
  }

  public async call(id: string, payload: any, opts?: any, ref?: any) {
    const filterFunc = this.filters[id];
    if (!filterFunc) {
      this.logger.warn(`XFILTER:CALL.ID.NOT_FOUND`, { id });
      return payload;
    }

    return filterFunc(payload, opts, ref);
  }

  public async exec<T = any>(
    data: GenericObject[],
    opts: IXFilterExecOpts
  ): Promise<T[]> {
    if (!Array.isArray(data) || !data.length) return data as any;

    const schema = opts.schema as IXFilterSchema;
    if (!schema) throw new Error("XFILTER:EXEC.NO_SCHEMA");

    return Promise.all(
      data.map((d) => this.filterItem<T>(d, schema, opts.ref))
    );
  }

  private async filterItem<T>(
    data: GenericObject,
    schema: IXFilterSchema,
    ref?: any
  ): Promise<T> {
    const props = await this.filterProps(data, schema, ref);
    // Update ref
    ref = { ...ref, $parent: { ...data, ...props, $parent: ref?.$parent } };
    const childProps = await this.filterChildsProps(data, schema, ref);

    return Object.assign({ ...data }, props, childProps) as any;
  }

  private async filterProps(
    data: any,
    schema: IXFilterSchema,
    ref?: any
  ): Promise<GenericObject> {
    const fields = Object.keys(schema).filter((fieldKey) =>
      Array.isArray(schema[fieldKey])
    );

    if (!fields.length) return {};

    const items: Array<{ [name: string]: any }> = await Promise.all(
      fields.map(async (field) => {
        const items = schema[field] as IXFilterSchemaItem[];
        const propValue = _.get(data, field);

        const schemaItems = items
          // Filter invalid filters
          .filter((i) => i?.id && Number.isInteger(Number(i.priority)))
          // Sort items in descending order
          .sort((prev, cur) => cur.priority - prev.priority);

        const value = await schemaItems.reduce(
          async (prePayload: Promise<any>, { id, opts }) =>
            this.call(id, await prePayload, opts, { $root: data, ...ref }),
          Promise.resolve(propValue)
        );

        this.logger.debug(`XFILTER:FILTER_PROP: ${field} - ${value}`);
        return { [field]: value };
      })
    );

    return Object.assign({}, ...items);
  }

  private async filterChildsProps(
    data: any,
    schema: IXFilterSchema,
    ref?: any
  ): Promise<GenericObject> {
    const fields = Object.keys(schema).filter(
      (fieldKey) => !Array.isArray(schema[fieldKey])
    );
    if (!fields.length) return {};

    const items = await Promise.all(
      fields.map(async (field) => {
        const childData = _.get(data, field);
        const nestedSchema = schema[field] as IXFilterSchema;

        // If input is array, return array of output as well
        if (Array.isArray(childData)) {
          const value = await Promise.all(
            (childData as any[]).map((d) =>
              this.filterItem(d, nestedSchema, ref)
            )
          );

          this.logger.debug(`XFILTER:FILTER_CHILD_PROP`, { field, value });
          return { [field]: value };
        }

        return {
          [field]: await this.filterItem(childData, nestedSchema, ref),
        };
      })
    );

    return Object.assign({}, ...items);
  }
}
