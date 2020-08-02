import { interfaces } from "inversify";
import { ILogger } from "@nodeplusplus/xregex-logger";

import { ITemplate } from "./Template";
import { IXFilter, IXFilterOptions } from "./XFilter";

export interface IBuilder {
  setLogger(logger: ILogger): void;
  setXFilter(
    Filter: interfaces.Newable<IXFilter>,
    options?: IXFilterOptions
  ): void;

  getContainer(): interfaces.Container;
  getXFilter(): IXFilter;
}

export interface IDirector {
  constructFromTemplate(builder: IBuilder, template: ITemplate): void;
}
