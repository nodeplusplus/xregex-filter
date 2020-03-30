import crypto from "crypto";

import { IXFilterFunction } from "../types/XFilter";

const md5: IXFilterFunction<string, any> = function md5(payload: any): string {
  if (!payload || !["string", "number"].includes(typeof payload)) {
    return payload;
  }

  return crypto
    .createHash("md5")
    .update(payload)
    .digest("hex");
};

export default md5;
