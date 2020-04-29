import { IXFilterFunction } from "../../types/XFilter";

const parse: IXFilterFunction = function parse(payload: any) {
  if (!payload || typeof payload !== "string") return payload;

  try {
    return JSON.parse(payload);
  } catch {
    return payload;
  }
};

export default parse;
