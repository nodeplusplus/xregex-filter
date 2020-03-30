import { IXFilterFunction } from "../types/XFilter";

const toNumber: IXFilterFunction<number> = function toNumber(
  payload: any,
  opts?: { defaultValue: number }
): number {
  const result = Number(payload) || opts?.defaultValue || 0;
  if (!Number.isFinite(result)) return payload;
  return result;
};

export default toNumber;
