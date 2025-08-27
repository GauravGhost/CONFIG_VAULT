export function getGridCols(width?: string) {
    switch (width) {
        case "1/2": return "sm:col-span-6";
        case "1/3": return "sm:col-span-4";
        case "2/3": return "sm:col-span-8";
        case "1/4": return "sm:col-span-3";
        case "3/4": return "sm:col-span-9";
        case "full":
        default:
            return "sm:col-span-12";
    }
}