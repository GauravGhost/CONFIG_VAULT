export class QueryBuilder {
    static buildWhereClause(criteria: Record<string, any>): { clause: string; values: any[] } {
        if (!criteria || Object.keys(criteria).length === 0) {
            return { clause: '', values: [] };
        }

        const entries = Object.entries(criteria).filter(([, value]) => value !== undefined);
        const conditions = entries.map(([key]) => `${key} = ?`);
        const values = entries.map(([, value]) => value);

        return {
            clause: `WHERE ${conditions.join(' AND ')}`,
            values
        };
    }

    static buildUpdateClause(item: Record<string, any>): { clause: string; values: any[] } {
        const entries = Object.entries(item).filter(([, value]) => value !== undefined);
        const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
        const values = entries.map(([, value]) => value);

        return { clause: setClause, values };
    }
}
