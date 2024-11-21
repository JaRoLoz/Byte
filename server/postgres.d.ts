declare var PG: {
    Ready: (cb: (err: string | null) => void) => void;
    ReadySync: () => string | null;
    Query: (query: string, args: any[], cb: (rows: any[], rowCount: number, error: string | undefined) => void) => void;
    QuerySync: (query: string, args: any[]) => [rows: any[], rowCount: number, error: string | undefined];
};
