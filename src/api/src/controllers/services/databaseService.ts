import { PoolConnection, Pool, createPool, Connection } from "mysql2/promise";

let connectionPool: Pool;

export function getConnection(): Promise<PoolConnection> {
    if (!connectionPool) {
        connectionPool = createPool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT as string),
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT as string),
        });
    }

    return connectionPool.getConnection();
}

export async function queryDatabase<T = any>(
    connection: Connection,
    query: string,
    ...values: any[]
): Promise<T> {
    const queryResult: any = await connection.query(query, values);

    return queryResult[0] as T;
}