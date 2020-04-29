import { IXFilterFunction } from "../../types/XFilter";

const toString: IXFilterFunction<string> = function toString(
  payload: any
): string {
  return String(payload);
};

export default toString;
