import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomJwtToken } from "../types/jwt";
// import { users } from "../fakeDatabase";
import { PoolConnection } from "mysql2/promise";
import { getConnection, queryDatabase } from "../controllers/services/databaseService";
import { UserData } from "@shared/types";
// import { get } from "http";

/**
 * Handles token-based authentication. If the token is valid, the user object is added to the request object.
 * If the token is invalid, a 401 error is returned.
 *
 * @param req - Request object
 * @param res - Response object
 *
 * @returns NextFunction | Status 401
 */
export async function handleTokenBasedAuthentication(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | NextFunction> {
    const authenticationToken: string | undefined = req.headers["authorization"];

    // Check if there is a token
    if (!authenticationToken) {
        res.status(401).send("Unauthorized");

        return;
    }

    // Check if the token is valid
    let jwtToken: CustomJwtToken | undefined;

    try {
        jwtToken = jwt.verify(
            authenticationToken,
            process.env.JWT_SECRET_KEY
        ) as CustomJwtToken;
    }
    catch {
        // Do nothing
    }

    if (!jwtToken) {
        res.status(401).send("Unauthorized");

        return next();
    }


        let connection: PoolConnection | null = null;
        try {
            //start connection
            connection = await getConnection();

            //get user from database with user_id from token
            const user: UserData[] = await queryDatabase(connection, "SELECT * FROM user WHERE user_id = ?", [jwtToken.userId]);

            //check if user exists
            if (!user) {
                res.status(401).send("Unauthorized");
                console.log("Unauthorized");
                return;
            }

            req.user = user[0];
            


        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });

            return;
        }

        //release connection
        finally {
            connection?.release();
        }

    return next();
}
