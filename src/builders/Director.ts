import { create as createLogger } from "@nodeplusplus/xregex-logger";

import { IDirector, IBuilder, ITemplate } from "../types";
import { XFilter } from "../XFilter";

export class Director implements IDirector {
  constructFromTemplate(builder: IBuilder, template: ITemplate) {
    builder.reset();
    builder.setLogger(
      createLogger(template.logger.type, template.logger.options)
    );

    builder.setXFilter(XFilter, template.XFilter);
  }
}
