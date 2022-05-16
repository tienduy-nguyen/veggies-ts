/* Custom type guards helping TS to infer types after filtering arrays
 *    const array: Array<number | undefined> = []
 *    const filteredArray = array.filter(n => !!n)  // filteredArray inferred as Array<number | undefined>
 *    const filteredArray = array.filter(isDefined) // filteredArray inferred as Array<number> =)
 */
export const isDefined = <T>(toTest: T | undefined | null): toTest is T => {
    return !!toTest
}

export const isNumber = (n: unknown): n is number => {
    return Number.isFinite(n)
}

export const isNotEmptyObject = <T extends Record<string, unknown> | Record<string, unknown>[]>(
    toTest?: T | null
): toTest is T => !!toTest && Object.values(toTest).some((value) => value != null)

export const isObject = (val: unknown): val is Record<string, unknown> =>
    !!val && typeof val === 'object' && !Array.isArray(val)

export const isEmpty = (val: unknown): boolean =>
    (!val && !isNumber(val)) || (typeof val === 'object' && Object.keys(val).length === 0)
