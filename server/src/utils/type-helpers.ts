/**
 * Removes undefined values from an object to ensure compatibility with
 * exactOptionalPropertyTypes: true in TypeScript
 */
export function removeUndefinedValues<T extends Record<string, any>>(
    obj: T
): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
            result[key] = value;
        }
    }
    
    return result;
}

/**
 * Prepares data for repository create operations by removing undefined values
 * and ensuring required fields have default values where needed
 */
export function prepareCreateData<T extends Record<string, any>>(
    data: T,
    defaults?: Partial<Record<keyof T, any>>
): Record<string, any> {
    const cleanData = removeUndefinedValues(data);
    
    // Apply defaults for any missing required fields
    if (defaults) {
        for (const [key, defaultValue] of Object.entries(defaults)) {
            if (!(key in cleanData)) {
                cleanData[key] = defaultValue;
            }
        }
    }
    
    return cleanData;
}

/**
 * Type guard to check if a value is defined (not undefined)
 */
export function isDefined<T>(value: T | undefined): value is T {
    return value !== undefined;
}
