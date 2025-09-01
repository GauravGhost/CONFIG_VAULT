type OrderDirection = "asc" | "desc";

type GetQueryParamsOptions = {
    query: any;
};

type QueryParams<T> = {
    includeRelations: boolean;
    orderBy?: {
        field: keyof T;
        direction: OrderDirection;
    } | undefined;
    filters: Partial<T>;
};

export function getQueryParams<T>({
    query,
}: GetQueryParamsOptions): QueryParams<T> {
    const includeRelations =
        query.includeRelations !== undefined ? query.includeRelations === "true" : true;
    const orderByField = query.orderByField as string;
    const orderByDirection = (query.orderByDirection as OrderDirection) ?? "asc";
    const orderBy =
        orderByField
            ? {
                field: orderByField as keyof T,
                direction: (orderByDirection as "asc" | "desc") ?? "asc",
            }
            : undefined;

    const reservedKeys = [
        "includeRelations",
        "orderByField",
        "orderByDirection",
    ];

    const filters: Partial<T> = Object.keys(query)
        .filter((key) => !reservedKeys.includes(key))
        .reduce((acc, key) => {
            acc[key as keyof T] = query[key];
            return acc;
        }, {} as Partial<T>);

    return {
        includeRelations,
        orderBy,
        filters,
    };
}