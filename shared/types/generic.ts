
// https://stackoverflow.com/questions/39494689
type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc["length"]]>;

/**
 * Returns a range of numbers from F to T, excluding T (`[F, T)`).
 */
export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;