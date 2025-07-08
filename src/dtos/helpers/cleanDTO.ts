export function cleanDTO<T extends Record<string, unknown>>(object: T): T {
    return Object.fromEntries(
        Object.entries(object).filter(([_, value]) => value !== undefined)
    ) as T;
}