declare module "knex-seed-file";

type Omit<A, B> = Pick<A, Exclude<keyof A, B extends object ? keyof B : B>>;
type OfType<A, Type> = Pick<
  A,
  {[K in keyof A]: A[K] extends Type ? K : never}[keyof A]
>
