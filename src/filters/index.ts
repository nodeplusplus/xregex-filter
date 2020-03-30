import { ISettingsFilters } from "../types/XFilter";

import concat from "./concat";
import createArrayOfProp from "./createArrayOfProp";
import divide from "./divide";
import formatURL from "./formatURL";
import get from "./get";
import getURLSearchParams from "./getURLSearchParams";
import JSONParse from "./JSONParse";
import match from "./match";
import md5 from "./md5";
import parseDatetime from "./parseDatetime";
import parseRelativeTime from "./parseRelativeTime";
import parseStringTime from "./parseStringTime";
import parseUnixTime from "./parseUnixTime";
import replace from "./replace";
import set from "./set";
import template from "./template";
import toNumber from "./toNumber";
import toScopeId from "./toScopeId";
import toSlug from "./toSlug";
import toString from "./toString";
import trim from "./trim";

const filterFuncions = [
  concat,
  createArrayOfProp,
  divide,
  formatURL,
  get,
  getURLSearchParams,
  JSONParse,
  match,
  md5,
  parseDatetime,
  parseRelativeTime,
  parseStringTime,
  parseUnixTime,
  replace,
  set,
  template,
  toNumber,
  toScopeId,
  toSlug,
  toString,
  trim,
];

const filters: ISettingsFilters = Object.assign(
  {},
  ...filterFuncions.map((f) => ({ [`filter.${f.name}`]: f }))
);

export default filters;
