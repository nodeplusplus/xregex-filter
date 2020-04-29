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
  const { toLowser = true, hash, pattern, replacement } = { ...opts };

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

  if (pattern && replacement) {
    let replacementValue = replacement;
    const isNormalReplaceValue = /(\$\d+)/.test(replacement);
    // Only get ref if replacement is not $1$2 or similar
    if (!isNormalReplaceValue && replacement.startsWith("$")) {
      replacementValue = _.get(ref, replacement);
    }

    if (replacementValue) {
      result = result.replace(new RegExp(pattern), replacementValue);
    }
  }

  return result;
};

export default replace;
export interface IXFilterFunctionReplaceOpts {
  toLowser?: boolean;
  hash?: GenericObject;
  pattern?: string;
  replacement?: string;
}
