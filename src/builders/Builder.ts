import { Container, interfaces } from "inversify";
import { ILogger } from "@nodeplusplus/xregex-logger";

import { IBuilder, IXFilter, IXFilterOptions } from "../types";

export class Builder implements IBuilder {
  private container!: interfaces.Container;

  constructor(container = new Container({ defaultScope: "Singleton" })) {
    this.container = container;
  }
  setLogger(logger: ILogger) {
    if (this.container.isBound("LOGGER")) return;

    this.container.bind<ILogger>("LOGGER").toConstantValue(logger);
  }
  setXFilter(Filter: interfaces.Newable<IXFilter>, options?: IXFilterOptions) {
    if (options?.directories) {
      this.container
        .bind<string[]>("XFILTER.DIRECTORIES")
        .toConstantValue(options.directories);
    }

    this.container.bind<IXFilter>("XFILTER").to(Filter);
  }

  getContainer() {
    return this.container;
  }
  getXFilter() {
    return this.container.get<IXFilter>("XFILTER");
  }
}
