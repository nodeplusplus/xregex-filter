import { IXFilterFunction } from "../types/XFilter";

const JSONParse: IXFilterFunction = function JSONParse(payload: any) {
  if (!payload || typeof payload !== "string") return payload;

  try {
    return JSON.parse(payload);
  } catch {
    return payload;
  }
};

export default JSONParse;
