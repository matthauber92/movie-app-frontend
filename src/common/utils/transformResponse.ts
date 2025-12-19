const toCamel = (s: string): string =>
    s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

export const mapResponse = <T>(input: unknown): T => {
    if (Array.isArray(input)) {
        return input.map(item => mapResponse(item)) as T;
    }

    if (input !== null && typeof input === 'object') {
        const obj = input as Record<string, unknown>;

        const result: Record<string, unknown> = {};

        for (const key of Object.keys(obj)) {
            const camelKey = toCamel(key);
            result[camelKey] = mapResponse(obj[key]);
        }

        return result as T;
    }

    return input as T;
};
