import _ from "lodash";

import { GenericObject } from "../../types/Common";
import { IXFilterFunction } from "../../types/XFilter";

const toScopeId: IXFilterFunction<
  string,
  any,
  IXFilterFunctionToScopeIdOpts,
  GenericObject
> = function toScopeId(
  payload: any,
  opts?: IXFilterFunctionToScopeIdOpts,
  ref?: GenericObject
): string {
  if (!payload || !opts?.prop) return payload;
  if (!["string", "number"].includes(typeof payload)) return payload;

  const scopeId = String(opts.prop).startsWith("$")
    ? _.get(ref, opts.prop)
    : opts.prop;
  return generateId(
    String(payload),
    String(scopeId),
    opts.seperator || DEFAULT_SEPERATOR
  );
};

export function generateId(
  id: string,
  scopeId: string,
  seperator: string
): string {
  const pattern = new RegExp(`(.*)${seperator}(.*)`);
  if (pattern.test(id)) id = id.split(seperator)[1];

  const scopes = scopeId.match(pattern);
  scopeId = (scopes && scopes[2]) || scopeId;

  return [scopeId, id].filter(Boolean).join(seperator);
}

export default toScopeId;
export const DEFAULT_SEPERATOR = "_";
export interface IXFilterFunctionToScopeIdOpts {
  prop: string | number;
  seperator?: string;
}
