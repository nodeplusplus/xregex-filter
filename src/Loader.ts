import path from "path";
import globby from "globby";

import { IXFilterFunction } from "./types/XFilter";

export class Loader {
  private directories = new Set<string>();

  constructor() {
    this.directories.add = this.directories.add.bind(this.directories);
    this.directories.delete = this.directories.delete.bind(this.directories);
  }

  public add(...paths: string[]) {
    paths.forEach(this.directories.add);
  }

  public remove(...paths: string[]) {
    paths.forEach(this.directories.delete);
  }

  async run(): Promise<{ [name: string]: IXFilterFunction }> {
    const directories = Array.from(this.directories);
    const globOpts = { expandDirectories: { extensions: ["js", "ts"] } };
    const filterPaths = await globby(directories, globOpts);

    const filters: { [name: string]: IXFilterFunction } = {};

    for (let filterPath of filterPaths) {
      const directory = path.dirname(filterPath).split(path.sep).pop();
      const name = path.parse(filterPath).name;

      const filterName = [directory, name].join(".");
      filters[filterName] = require(filterPath).default;
    }

    return filters;
  }
}
