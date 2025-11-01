declare module "uuid" {
  export interface V7Options {
    msecs?: number;
  }

  export function v7(options?: V7Options): string;
}
