/**
 * @fileoverview Core functional types for the Container CLI service
 * These types form the foundation of a purely functional architecture
 */

/**
 * Either type - represents success or failure in a functional way
 * Named 'Either' following functional programming convention
 * Right = success, Left = failure
 */
export type Either<L, R> =
  | { type: 'Left'; value: L }
  | { type: 'Right'; value: R };

/**
 * Functional constructor for Left (error)
 */
export const Left = <L, R = never>(value: L): Either<L, R> => ({
  type: 'Left',
  value
});

/**
 * Functional constructor for Right (success)
 */
export const Right = <R, L = never>(value: R): Either<L, R> => ({
  type: 'Right',
  value
});

/**
 * Type guard: is the Either a Left?
 */
export const isLeft = <L, R>(either: Either<L, R>): either is { type: 'Left'; value: L } =>
  either.type === 'Left';

/**
 * Type guard: is the Either a Right?
 */
export const isRight = <L, R>(either: Either<L, R>): either is { type: 'Right'; value: R } =>
  either.type === 'Right';

/**
 * Map over the Right value, leaving Left untouched
 */
export const mapRight = <L, R, R2>(
  fn: (value: R) => R2
) => (either: Either<L, R>): Either<L, R2> =>
  isRight(either) ? Right(fn(either.value)) : either;

/**
 * Map over the Left value, leaving Right untouched
 */
export const mapLeft = <L, L2, R>(
  fn: (value: L) => L2
) => (either: Either<L, R>): Either<L2, R> =>
  isLeft(either) ? Left(fn(either.value)) : either;

/**
 * Flat map (bind) for Either - chain operations
 */
export const flatMap = <L, R, R2>(
  fn: (value: R) => Either<L, R2>
) => (either: Either<L, R>): Either<L, R2> =>
  isRight(either) ? fn(either.value) : either;

/**
 * Fold Either - extract value with default handlers
 */
export const fold = <L, R, T>(
  onLeft: (value: L) => T,
  onRight: (value: R) => T
) => (either: Either<L, R>): T =>
  isLeft(either) ? onLeft(either.value) : onRight(either.value);

/**
 * Get Right value or return default
 */
export const getOrElse = <L, R>(defaultValue: R) =>
  (either: Either<L, R>): R =>
    isRight(either) ? either.value : defaultValue;

/**
 * Pipe composition for Either operations
 */
export const pipeEither = <L, R>(either: Either<L, R>) =>
  (fns: Array<(e: Either<L, any>) => Either<L, any>>): Either<L, any> =>
    fns.reduce((acc, fn) => fn(acc), either);

/**
 * Async version of flat map
 */
export const flatMapAsync = <L, R, R2>(
  fn: (value: R) => Promise<Either<L, R2>>
) => async (either: Either<L, R>): Promise<Either<L, R2>> =>
  isRight(either) ? fn(either.value) : either;

/**
 * Convert a throwing function to Either
 */
export const tryCatch = <L, R>(
  fn: () => R,
  onError: (error: unknown) => L
): Either<L, R> => {
  try {
    return Right(fn());
  } catch (error) {
    return Left(onError(error));
  }
};

/**
 * Convert a throwing async function to Either
 */
export const tryCatchAsync = <L, R>(
  fn: () => Promise<R>,
  onError: (error: unknown) => L
) => async (): Promise<Either<L, R>> => {
  try {
    return Right(await fn());
  } catch (error) {
    return Left(onError(error));
  }
};
