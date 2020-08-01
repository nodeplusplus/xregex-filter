import { LoggerType, ILoggerCreatorOpts } from "@nodeplusplus/xregex-logger";

import { IXFilterOptions } from "./XFilter";

export interface ITemplate {
  logger: { type: LoggerType; options?: ILoggerCreatorOpts };
  XFilter?: IXFilterOptions;
}
