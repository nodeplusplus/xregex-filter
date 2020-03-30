import slug from "slug";

import { IXFilterFunction } from "../types/XFilter";

const toSlug: IXFilterFunction<string> = function toSlug(
  payload: string,
  opts?: IXFilterFunctionToSlugOpts
): string {
  if (!payload || typeof payload !== "string") return payload;

  return slug(payload, { ...opts });
};

export default toSlug;
export interface IXFilterFunctionToSlugOpts {
  charmap?: { [x: string]: string } | null;
  lower?: boolean | null;
  multicharmap?: { [x: string]: string } | null;
  remove?: RegExp | null;
  replacement?: string | null;
  symbols?: boolean | null;
}
