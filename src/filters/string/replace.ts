import _ from "lodash";

import { GenericObject } from "../../types/Common";
import { IXFilterFunction } from "../../types/XFilter";

const replace: IXFilterFunction<
  string,
  any,
  IXFilterFunctionReplaceOpts
> = function replace(
  payload: any,
  opts?: IXFilterFunctionReplaceOpts,
  ref?: any
): string {
  const { toLowser = true, hash, pattern, patternFlags, value } = { ...opts };

  if (!payload || !["number", "string"].includes(typeof payload)) {
    return payload;
  }

  // Convert to lower case first
  let result = toLowser ? String(payload).toLowerCase() : String(payload);

  // Replace with hash
  if (hash) {
    const hashPattern = Object.keys(hash)
      .sort((prev, cur) => cur.length - prev.length)
      .join("|");
    result = result.replace(
      new RegExp(hashPattern),
      (matched) => hash[matched]
    );
  }

  if (pattern && typeof value !== "undefined") {
    let replaceValue = value;
    // value could be ref value
    const isNormalReplaceValue = /(\$\d+)/.test(value);
    // Only get ref if value is not $1$2 or similar
    if (!isNormalReplaceValue && value.startsWith("$")) {
      replaceValue = _.get(ref, value);
    }

    if (typeof replaceValue !== "undefined") {
      result = result.replace(new RegExp(pattern, patternFlags), replaceValue);
    }
  }

  return result;
};

export default replace;
export interface IXFilterFunctionReplaceOpts {
  toLowser?: boolean;
  hash?: GenericObject;
  pattern?: string;
  patternFlags?: string;
  value?: string;
}
