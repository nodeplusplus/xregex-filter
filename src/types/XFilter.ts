import { GenericObject } from "./Common";

export interface IXFilter {
  filters: ISettingsFilters;

  start(opts?: any): Promise<void>;
  stop(opts?: any): Promise<void>;

  call<T = any>(id: string, payload?: any, opts?: any, ref?: any): Promise<T>;
  exec<T extends GenericObject>(
    data: any[],
    opts: IXFilterExecOpts
  ): Promise<T[]>;
}

export interface IXFilterExecOpts {
  schema: IXFilterSchema;
  ref?: any;
}

export interface IXFilterSchema {
  [name: string]: IXFilterSchema | IXFilterSchemaItem[];
}

export interface IXFilterSchemaItem<O = any> {
  id: string;
  priority: number;
  opts?: O;
}

export interface ISettings {
  directories?: string[];
}
export type ISettingsFilters = { [name: string]: IXFilterFunction };

export interface IXFilterFunction<T = any, P = any, O = any, R = any> {
  (payload?: P, opts?: O, ref?: R): T;
}
