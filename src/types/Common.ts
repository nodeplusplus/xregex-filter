export interface GenericObject<T = any> {
  [name: string]: T;
}

export type DeepPartial<T = any> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

export interface ILogger {
  fatal(message: string, ...additionalProps: GenericObject[]): void;
  error(message: string, ...additionalProps: GenericObject[]): void;
  warn(message: string, ...additionalProps: GenericObject[]): void;
  info(message: string, ...additionalProps: GenericObject[]): void;
  debug(message: string, ...additionalProps: GenericObject[]): void;
  trace(message: string, ...additionalProps: GenericObject[]): void;
}
