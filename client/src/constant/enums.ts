import { cn } from "@/lib/utils";

export const storageKeys = {
    LANGUAGE: 'language',
    AUTH_TOKEN: "auth-token"
} as const;

export const colorTheme = {
    red: {
        text: "text-red-800 dark:text-red-300",
        bg: "bg-red-100 dark:bg-red-900/20",
        mix: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
    },
    blue: {
        text: "text-blue-800 dark:text-blue-300",
        bg: "bg-blue-100 dark:bg-blue-900/20",
        mix: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
    },
    green: {
        text: "text-green-800 dark:text-green-300",
        bg: "bg-green-100 dark:bg-green-900/20",
        mix: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    },
    gray: {
        text: "text-gray-800 dark:text-gray-300",
        bg: "bg-gray-100 dark:bg-gray-900/20",
        mix: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
}

export type StorageKey = keyof typeof storageKeys;