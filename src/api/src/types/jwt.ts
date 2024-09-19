import { JwtPayload } from "jsonwebtoken";

/**
 * This is the payload for a JWT token of an authenticated user
 */
export type CustomJwtPayload = {
    userId: number;
};

/**
 * This is the full JWT token when decoded.
 */
export type CustomJwtToken = JwtPayload & CustomJwtPayload;
