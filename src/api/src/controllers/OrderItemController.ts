import { Request, Response } from "express";
// import { orderItems } from "../fakeDatabase";
import { OrderItem } from "@shared/types";
import { PoolConnection } from "mysql2/promise";
import { getConnection } from "./services/databaseService";

/**
 * Handles all endpoints related to the Order Item resource
 */
export class OrderItemController {
    /**
     * Get all order items
     * 
     * @param _ Request object (unused)
     * @param res Response object
     */
    public async getAll(_: Request, res: Response): Promise<void> {
        let orderItems: OrderItem[] = [];
        let connection: PoolConnection | null = null;

        try {
            connection = await getConnection();

            const resultItems: any = await connection.query(`
            SELECT 
                p.product_id,
                p.name,
                p.price,
                p.inventory_quantity,
                p.average_rating,
                p.category,
                p.description,
                p.image_urls,
                COALESCE(g.game_id, gm.game_id) AS game_id,
                m.merchandise_id
            FROM 
                product p
            LEFT JOIN 
                game g ON p.product_id = g.product_id
            LEFT JOIN 
                merchandise m ON p.product_id = m.product_id
            LEFT JOIN
                game_merchandise gm ON m.merchandise_id = gm.merchandise_id
        `);

            orderItems = resultItems[0] as OrderItem[];
            res.json(orderItems);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });
        }
        finally {
            connection?.release();
        }
    }
}
