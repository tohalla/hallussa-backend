declare module "knex-seed-file";

type OfType<A, Type> = Pick<
  A,
  {[K in keyof A]: A[K] extends Type ? K : never}[keyof A]
>
