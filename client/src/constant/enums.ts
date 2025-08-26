export const storageKeys = {
    LANGUAGE: 'language',
    TOKEN: "token"
} as const;

export type StorageKey = keyof typeof storageKeys;