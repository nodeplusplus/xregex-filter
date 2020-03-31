import { IXFilterFunction } from "../types/XFilter";

const trim: IXFilterFunction<string, any> = function trim(
  payload: any
): string {
  if (!payload || typeof payload !== "string") return payload;

  return payload.trim();
};

export default trim;
