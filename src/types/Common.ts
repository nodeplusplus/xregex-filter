export interface GenericObject<T = any> {
  [name: string]: T;
}

export type DeepPartial<T = any> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;
