import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Address, CartItem, Order, OrderItem, UserData } from "@shared/types";
import { UserLoginFormModel, UserRegisterFormModel } from "@shared/formModels";
// import { orderItems } from "../fakeDatabase";
import { CustomJwtPayload } from "../types/jwt";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { getConnection, queryDatabase } from "./services/databaseService";
import { PoolConnection } from "mysql2/promise";
import { UserCartResponse } from "@shared/responses/UserCartResponse";
import { Game } from "@shared/types/Game";
import { Merchandise } from "@shared/types/Merchandise";
import { product } from "@shared/types/product";
import { OrderItemWithProduct } from "@shared/types/OrderItemWithProduct";
import { UserWishlistResponse } from "@shared/responses/UserWishlistResponse";
import { WishItem } from "@shared/types";

/**
 * Handles all endpoints related to the User resource
 */
export class UserController {
    /**
     * Register a user using {@link UserRegisterFormModel}
     *
     * Returns a 200 with a message when successful.
     * Returns a 400 with a message detailing the reason otherwise.
     *
     * @param req Request object
     * @param res Response object
     */

    public user_id: number = 0;

    public async register(req: Request, res: Response): Promise<void> {
        const formModel: UserRegisterFormModel = req.body as UserRegisterFormModel;
        let connection: PoolConnection | null = null;

        //validate if all fields are filled in
        if (!formModel.email || !formModel.password || !formModel.voornaam || !formModel.achternaam) {
            res.status(400).json({ message: "Please fill in all the fields." });
            console.log("Please fill in all the fields.");
            return;
        }

        // Validate if the email already exists
        try {
            connection = await getConnection();

            const resultEmail: any = await queryDatabase(
                connection,
                "SELECT email FROM user WHERE email = ?",
                [formModel.email]
            );

            if (resultEmail.length > 0) {
                res.status(400).json({ message: "This email address is already used." });
                console.log("This email address is already used.");
                return;
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });

            return;
        } finally {
            connection?.release();
        }

        // Hash the password
        const hashedPassword: string = bcrypt.hashSync(formModel.password, 10);

        // Add the user to the database
        try {
            connection = await getConnection();

            const result: any = await queryDatabase(
                connection,
                "INSERT INTO user (email, firstName, lastName, password) VALUES (?) ",
                [formModel.email, formModel.voornaam, formModel.achternaam, hashedPassword]
            );
            if (result.affectedRows === 0) {
                res.status(400).json({ message: "Failed to register user." });
                console.log("Failed to register user.");
                return;
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });

            return;
        } finally {
            connection?.release();
        }

        res.status(200).json({ message: "Successfully registered user." });
        console.log("Successfully registered user.");
    }

    /**
     * Login a user using a {@link UserLoginFormModel}.
     *
     * @param req - Request object
     * @param res - Response object
     * @returns A 200 status with a JWT token when successful, or a 400/500 status with an error message.
     */
    public async login(req: Request, res: Response): Promise<void> {
        const formModel: UserLoginFormModel = req.body as UserLoginFormModel;
        let connection: PoolConnection | null = null;

        //validate if all fields are filled in
        if (!formModel.email || !formModel.password) {
            res.status(400).json({ message: "Please fill in all the fields." });
            console.log("Please fill in all the fields.");
            return;
        }

        try {
            //start connection
            connection = await getConnection();

            //Get password and user_id from database
            const resultPassword: any = await queryDatabase(
                connection,
                "SELECT password, user_id FROM user WHERE email = ?",
                [formModel.email]
            );

            //Check if email exists
            if (resultPassword.length === 0) {
                res.status(400).json({ message: "email not found" });
                console.log("email not found");
                return;
            }

            //compare hashed password in database with password from form
            const passwordMatch: boolean = bcrypt.compareSync(formModel.password, resultPassword[0].password);

            //password incorrect, respond with 400
            if (!passwordMatch) {
                res.status(400).json({ message: "Incorrect password" });
                console.log("Incorrect password");

                return;
            }

            //set user_id if password is correct
            this.user_id = resultPassword[0].user_id;
        } catch (error) {
            // Internal server error, respond with 500, return
            console.error(error);
            res.status(500).json({ message: "Internal server error." });

            return;
        } finally {
            //release connection
            connection?.release();
        }

        // Generate a JWT Token
        //assign user_id to payload/token
        const payload: CustomJwtPayload = { userId: this.user_id };

        const token: string = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        res.json({ token });
        console.log("Successfully logged in.");
    }

    /**
     * Logout a user using a valid JWT token.
     *
     * @param _ - Request object (unused)
     * @param res - Response object
     * @returns Always returns a 200 status with a success message.
     */
    public logout(_: Request, res: Response): void {
        // TODO: Optional, but revoke the JWT Token.

        res.json({
            message: "You are logged out.",
        });
    }

    /**
    /**
     * Temporary method to return some data about a user with a valid JWT token.
     *
     * @param req - Request object
     * @param res - Response object
     * @returns Always returns a 200 status with {@link UserHelloResponse} as the body.
     */
    public async hello(req: Request, res: Response): Promise<void> {
        const userData: UserData = req.user!;

        //create connection
        let connection: PoolConnection | null = null;

        const token: string | undefined = req.headers.authorization;
        // check if user_id is set / is logged in
        if (token) {
            try {
                //start connection
                connection = await getConnection();
                //check if user has a cart
                const resultCart_id: any = await queryDatabase(
                    connection,
                    "SELECT cart_id FROM cart WHERE user_id = ?",
                    [userData.user_id]
                );
                //user has no cart
                if (resultCart_id.length === 0) {
                    console.log("No cart found");
                    const response: UserHelloResponse = {
                        email: userData.email,
                        cartItems: [],
                    };

                    res.json(response);
                    return;
                }
                const cart_id: number = resultCart_id[0].cart_id;
                // user has a cart
                if (resultCart_id.length > 0) {
                    //select all items from cart
                    const resultCartItems: any = await queryDatabase(
                        connection,
                        "SELECT cartitem.name, cartitem.price, product.description, product.image_urls \
                        FROM cartitem \
                        INNER JOIN product ON cartitem.product_id = product.product_id \
                        WHERE cartitem.cart_id = ?",
                        [cart_id]
                    );

                    //only select the name of the items
                    const response: UserHelloResponse = {
                        email: userData.email,
                        cartItems: resultCartItems.map((e: any) => e.name),
                    };

                    // return response
                    res.json(response);
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error." });

                return;
            } finally {
                //release connection
                connection?.release();
            }
        }

        // No token found
        else {
            res.status(400).json({ message: "No token found" });
            return;
        }
    }

    /**
     * Get the cart of the user
     *
     * @param req Request object
     * @param res Response object
     * @returns {@link UserCartResponse}
     */
    public async getWishlist(req: Request, res: Response): Promise<void> {
        const userData: UserData = req.user!;

        //create connection
        let connection: PoolConnection | null = null;

        const token: string | undefined = req.headers.authorization;
        // check if user_id is set / is logged in
        if (token) {
            try {
                //start connection
                connection = await getConnection();
                //check if user has a cart
                const resultCart_id: any = await queryDatabase(
                    connection,
                    "SELECT wishlist_id FROM wishlist WHERE user_id = ?",
                    userData.user_id
                );

                //user has no wishlist
                if (resultCart_id.length === 0) {
                    console.log("No wishlist found");
                    const response: UserCartResponse = {
                        email: userData.email,
                        cartItems: [],
                    };

                    res.json(response);
                    return;
                }

                if (resultCart_id.length > 0) {
                    //select all items
                    const resultWishlistItems: any = await queryDatabase(
                        connection,
                        "SELECT wishlist.wishlist_id, wishlist.product_id, wishlist.user_id, product.name, product.description, product.image_urls FROM wishlist INNER JOIN product ON wishlist.product_id = product.product_id WHERE user_id = ?;",
                        userData.user_id
                    );

                    console.log(resultWishlistItems);

                    //only select the name of the items
                    const response: UserWishlistResponse = {
                        email: userData.email,
                        wishlistItems: resultWishlistItems.map((e: any) => ({
                            wishlist_item_id: e.wishlist_id,
                            product_id: e.product_id,
                            name: e.name,
                            price: e.price,
                            description: e.description,
                            image_urls: e.image_urls,
                            quantity: e.quantity,
                        })),
                    };

                    // return response
                    res.json(response);
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error." });

                return;
            } finally {
                //release connection
                connection?.release();
            }
        }

        // No token found
        else {
            res.status(400).json({ message: "No token found" });
            return;
        }
    }


    public async addItemToWishlist(req: Request, res: Response): Promise<void> {
        const userData: UserData = req.user!;
        const user_id: number = userData.user_id;
        console.log(user_id);

        const wishItem: WishItem = req.body as WishItem;
        console.log(wishItem);

        //create connection
        let connection: PoolConnection | null = null;

        try {
            //start connection
            connection = await getConnection();
            // user has no cart
            if (user_id > 0) {
                //create cart
                // await queryDatabase(connection, "INSERT INTO wishlist (user_id) VALUES (?)", [user_id]);
                //select cart_id
                //add item to cart
                const resultCart: any = await queryDatabase(
                    connection,
                    "INSERT INTO wishlist (wishlist_id, product_id, user_id) VALUES ( ?, ?, ? )",
                    wishItem.wishlist_id, wishItem.product_id, user_id
                );
                //check if item is added
                if (resultCart.affectedRows === 1) {
                    console.log("Successfully added item to cart");
                    return;
                } else {
                    console.log("Failed to add item to cart");
                    return;
                }
            }
            //user dont a cart
            else {
                console.log("niet mogelijk");

            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });

            return;
        } finally {
            connection?.release();
        }

        // TODO: Validation
    }

    public async removeItemFromWishlist(req: Request, res: Response): Promise<void> {
        let connection: PoolConnection | null = null;

        try {
            connection = await getConnection();

            const productItemId: number = req.body.product_id;
            console.log("Received productItemId:", productItemId); // Add logging

            if (!productItemId) {
                res.status(400).json({ message: "Product ID is required." });
                return;
            }

            const result: any = await queryDatabase(
                connection,
                "DELETE FROM wishlist WHERE product_id = ?",
                [productItemId]
            );

            if (result.affectedRows === 0) {
                res.status(400).json({ message: "No wishlist item found with this id." });
                return;
            }

            res.status(200).json({ message: "Successfully removed item from wishlist." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });
        } finally {
            connection?.release();
        }
    }

    /**
     * Get the cart of the user
     *
     * @param req Request object
     * @param res Response object
     * @returns {@link UserCartResponse}
     */
    public async getCart(req: Request, res: Response): Promise<void> {
        const userData: UserData = req.user!;

        //create connection
        let connection: PoolConnection | null = null;

        const token: string | undefined = req.headers.authorization;
        // check if user_id is set / is logged in
        if (token) {
            try {
                //start connection
                connection = await getConnection();
                //check if user has a cart
                const resultCart_id: any = await queryDatabase(
                    connection,
                    "SELECT cart_id FROM cart WHERE user_id = ?",
                    [userData.user_id]
                );
                //user has no cart
                if (resultCart_id.length === 0) {
                    console.log("No cart found");
                    const response: UserCartResponse = {
                        email: userData.email,
                        cartItems: [],
                    };

                    res.json(response);
                    return;
                }
                const cart_id: number = resultCart_id[0].cart_id;
                // user has a cart
                if (resultCart_id.length > 0) {
                    //select all items from cart with cart_id
                    const resultCartItems: any = await queryDatabase(
                        connection,
                        "SELECT cartitem.cart_item_id, cartitem.name, cartitem.price, cartitem.quantity, product.description, product.product_id, product.image_urls \
                        FROM cartitem \
                        INNER JOIN product ON cartitem.product_id = product.product_id \
                        WHERE cartitem.cart_id = ?",
                        [cart_id]
                    );

                    //only select the name of the items
                    const response: UserCartResponse = {
                        cart_id: cart_id,
                        email: userData.email,
                        cartItems: resultCartItems.map((e: any) => ({
                            cart_item_id: e.cart_item_id,
                            product_id: e.product_id,
                            name: e.name,
                            price: e.price,
                            description: e.description,
                            image_urls: e.image_urls,
                            quantity: e.quantity,
                        })),
                    };

                    // return response
                    res.json(response);
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error." });

                return;
            } finally {
                //release connection
                connection?.release();
            }
        }

        // No token found
        else {
            res.status(400).json({ message: "No token found" });
            return;
        }
    }

    public async addOrderItemToCart(req: Request, res: Response): Promise<void> {
        const userData: UserData = req.user!;
        const user_id: number = userData.user_id;

        const orderItem: OrderItem = req.body as OrderItem;

        //create connection
        let connection: PoolConnection | null = null;

        try {
            //start connection
            connection = await getConnection();
            //check if user has a cart
            const resultCart: any = await queryDatabase(connection, "SELECT * FROM cart WHERE user_id = ?", [
                user_id,
            ]);
            // user has no cart
            if (resultCart.length === 0) {
                //create cart
                await queryDatabase(connection, "INSERT INTO cart (user_id) VALUES (?)", [user_id]);
                //select cart_id
                const resultCart_id: any = await queryDatabase(
                    connection,
                    "SELECT cart_id FROM cart WHERE user_id = ?",
                    [user_id]
                );
                const cart_id: number = resultCart_id[0].cart_id;
                //add item to cart
                const resultCart: any = await queryDatabase(
                    connection,
                    "INSERT INTO cartitem (cart_id, product_id, name, quantity, price) VALUES (?)",
                    [cart_id, orderItem.product_id, orderItem.name, 1, orderItem.price]
                );
                //check if item is added
                if (resultCart.affectedRows === 1) {
                    console.log("Successfully added item to cart");
                    return;
                } else {
                    console.log("Failed to add item to cart");
                    return;
                }
            }
            //user has a cart
            else {
                const resultCart_id: any = await queryDatabase(
                    connection,
                    "SELECT cart_id FROM cart WHERE user_id = ?",
                    [user_id]
                );
                const cart_id: number = resultCart_id[0].cart_id;
                console.log("Checking if product already exists in cart");
                const existingProduct: any = await queryDatabase(
                    connection,
                    "SELECT * FROM cartitem WHERE cart_id = ? AND product_id = ?",
                    cart_id,
                    orderItem.product_id
                );

                if (existingProduct.length > 0) {
                    // If the product exists, increment the quantity
                    const resultCart: any = await queryDatabase(
                        connection,
                        "UPDATE cartitem SET quantity = quantity + 1 WHERE cart_id = ? AND product_id = ?",
                        cart_id,
                        orderItem.product_id
                    );
                    console.log("Successfully incremented quantity of existing item in cart");
                    if (resultCart.affectedRows === 1) {
                        console.log("Successfully incremented quantity of existing item in cart");
                    }
                } else {
                    // If the product does not exist, add it to the cart
                    const resultCart: any = await queryDatabase(
                        connection,
                        "INSERT INTO cartitem (cart_id, product_id, name, quantity, price) VALUES (?)",
                        [cart_id, orderItem.product_id, orderItem.name, 1, orderItem.price]
                    );
                    // Check if item is added
                    if (resultCart.affectedRows === 1) {
                        console.log("Successfully added item to cart");
                    } else {
                        console.log("Failed to add item to cart");
                    }
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });

            return;
        } finally {
            connection?.release();
        }

        // TODO: Validation
    }

    /**
     * Remove an order item from the cart of the user.
     *
     * @param req - Request object.
     * @param res - Response object.
     * @returns A 200 status with a success message when successful, or a 400/500 status with an error message.
     */
    public async removeOrderItemFromCart(req: Request, res: Response): Promise<void> {
        //create connection
        let connection: PoolConnection | null = null;

        try {
            connection = await getConnection();

            const cartItemId: number = req.body.cartItemId;

            const result: any = await queryDatabase(
                connection,
                "DELETE FROM cartitem WHERE cart_item_id = ?",
                [cartItemId]
            );

            if (result.affectedRows === 0) {
                res.status(400).json({ message: "No cart item found with this id." });
                return;
            }

            res.status(200).json({ message: "Successfully removed item from cart." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });

            return;
        } finally {
            connection?.release();
        }
    }

    public async updateCartItemQuantity(req: Request, res: Response): Promise<void> {
        //create connection
        let connection: PoolConnection | null = null;

        try {
            connection = await getConnection();

            const cartItemId: number = req.body.cartItemId;
            const newQuantity: number = req.body.newQuantity;

            const result: any = await queryDatabase(
                connection,
                "UPDATE cartitem SET quantity = ? WHERE cart_item_id = ?",
                newQuantity,
                cartItemId
            );

            if (result.affectedRows === 0) {
                res.status(400).json({ message: "No cart item found with this id." });
                return;
            }

            res.status(200).json({ message: "Successfully updated cart item quantity." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });

            return;
        } finally {
            connection?.release();
        }
    }

    /**
     * Retrieves all user information related to the provided user_id.
     * @param req - Request object.
     * @param res - Response object.
     * @returns Promise<void>.
     */
    public async getAllUserInfo(req: Request, res: Response): Promise<void> {
        let userData: UserData = req.user!;
        let connection: PoolConnection | null = null;

        try {
            connection = await getConnection();

            const resultUserInfo: any = await queryDatabase(
                connection,
                "SELECT user.user_id, user.email, user.firstName, user.lastName, user.newsletter_status, user.authorization_level_id \
                    FROM user \
                    WHERE user.user_id = ?",
                [userData.user_id]
            );

            userData = resultUserInfo as UserData;
            res.json(userData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });
        } finally {
            connection?.release();
        }
    }

    /**
     * Changes user data for the logged-in user.
     * @param req - Request object.
     * @param res - Response object.
     * @returns Promise<void>.
     */
    public async changeUserData(req: Request, res: Response): Promise<void> {
        const userData: UserData = req.user as UserData;
        const newUserData: {
            email: string;
            firstName: string;
            lastName: string;
            newsletter_status: boolean;
        } = req.body;

        let connection: PoolConnection | null = null;

        try {
            connection = await getConnection();

            // Update user data in the database
            const result: any = await queryDatabase(
                connection,
                "UPDATE user SET email = ?, firstName = ?, lastName = ?, newsletter_status = ? WHERE user_id = ?",
                newUserData.email,
                newUserData.firstName,
                newUserData.lastName,
                newUserData.newsletter_status,
                userData.user_id
            );

            if (result.affectedRows === 0) {
                res.status(400).json({ message: "Failed to update user data." });
                return;
            }

            res.status(200).json({ message: "User data updated successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });
        } finally {
            connection?.release();
        }
    }

    /**
     * Updates the newsletter subscription status for the logged-in user.
     * @param req - Request object.
     * @param res - Response object.
     * @returns Promise<void>.
     */
    public async updateNewsletterStatus(req: Request, res: Response): Promise<void> {
        const status: boolean = req.body.status;
        const userData: UserData = req.user as UserData;

        let connection: PoolConnection | null = null;

        try {
            connection = await getConnection();

            // Update newsletter status in the database
            const result: any = await queryDatabase(
                connection,
                "UPDATE user SET newsletter_status = ? WHERE user_id = ?",
                status,
                userData.user_id
            );

            if (result.affectedRows === 0) {
                res.status(400).json({ message: "Failed to update newsletter status." });
                return;
            }
            console.log("Newsletter status updated successfully.");
            res.status(200).json({ message: "Newsletter status updated successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });
        } finally {
            connection?.release();
        }
    }

    /**
     * Retrieves all users and their information.
     * @param _req - Request object.
     * @param res - Response object.
     * @returns Promise<void>.
     */
    public async getAllUsers(_req: Request, res: Response): Promise<void> {
        console.log("start get all users");

        let connection: PoolConnection | null = null;

        try {
            connection = await getConnection();

            const resultUsers: any = await queryDatabase(
                connection,
                "SELECT user_id, email, firstName, lastName, newsletter_status, authorization_level_id FROM user"
            );
            if (resultUsers.length === 0) {
                res.status(404).json({ message: "No users found." });
                return;
            }

            res.status(200).json(resultUsers);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });
        } finally {
            connection?.release();
        }
    }

    /**
     * Updates the role of a user.
     * @param req - Request object.
     * @param res - Response object.
     * @returns Promise<void>.
     */
    public async updateRole(req: Request, res: Response): Promise<void> {
        const { userId, authorization_level_id } = req.body;

        // Check if user ID is provided
        if (!userId) {
            res.status(400).json({ message: "User ID is missing in the request." });
            return;
        }

        // Check if authentication level ID is provided
        if (!authorization_level_id) {
            res.status(400).json({ message: "Authentication level ID is required." });
            return;
        }

        let connection: PoolConnection | null = null;

        try {
            connection = await getConnection();

            // Update user's authentication level in the database
            const result: any = await queryDatabase(
                connection,
                "UPDATE user SET authorization_level_id = ? WHERE user_id = ?",
                authorization_level_id,
                userId
            );

            // Check if user was found and updated
            if (result.affectedRows === 0) {
                res.status(404).json({ message: "User not found." });
                return;
            }

            // Send success response
            res.status(200).json({ message: "User updated successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });
        } finally {
            connection?.release();
        }
    }

    public async searchProduct(req: Request, res: Response): Promise<void> {
        let connection: PoolConnection | null = null;

        try {
            const searchName: string = req.query.name as string;
            connection = await getConnection();
            const query: string = "SELECT * FROM product WHERE name LIKE ?";
            const formattedSearchName: any = `%${searchName}%`;
            console.log(`Executing query: ${query} with parameter: ${formattedSearchName}`);

            const [results]: any = await queryDatabase(connection, query, [formattedSearchName]);
            console.log("Query results:", results);

            if (results.length === 0) {
                res.status(404).json({ message: "No products found" });
            } else {
                // Sort results by name
                results.sort((a: any, b: any) => a.name.localeCompare(b.name));
                res.json(results);
            }
        } catch (err) {
            console.error("Failed to fetch products:", err);
            res.status(500).send(err);
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    /**
     * Deletes a user.
     * @param req - Request object.
     * @param res - Response object.
     * @returns Promise<void>.
     */
    public async deleteUser(req: Request, res: Response): Promise<void> {
        const userId: number = req.body.userId;
        if (!userId) {
            res.status(400).json({ message: "User ID is missing in the request." });
            return;
        }

        let connection: PoolConnection | null = null;

        try {
            connection = await getConnection();

            const result: any = await queryDatabase(connection, "DELETE FROM user WHERE user_id = ?", [
                userId,
            ]);

            if (result.affectedRows === 0) {
                res.status(404).json({ message: "User not found." });
                return;
            }

            res.status(200).json({ message: "User deleted successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });
        } finally {
            connection?.release();
        }
    }

    public async addAddress(req: Request, res: Response): Promise<void> {
        const { type, street, city, zip, country }: Address = req.body as Address;

        // Extract user_id from request context
        const userData: UserData = req.user!;
        const user_id: number = userData.user_id;

        // Validate if all fields are filled in
        if (!type || !street || !city || !zip || !country) {
            res.status(400).json({ message: "Please fill in all the fields." });
            console.log("Please fill in all the fields.");
            return;
        }

        let connection: PoolConnection | null = null;

        try {
            connection = await getConnection();

            // Insert the address into the database
            const result: any = await queryDatabase(
                connection,
                "INSERT INTO address (user_id, type, street, city, zip, country) VALUES (?, ?, ?, ?, ?, ?)",
                user_id,
                type,
                street,
                city,
                zip,
                country
            );

            if (result.affectedRows === 1) {
                res.status(200).json({ message: "Successfully added address." });
                console.log("Successfully added address.");
            } else {
                res.status(400).json({ message: "Failed to add address." });
                console.log("Failed to add address.");
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });
        } finally {
            connection?.release();
        }
    }
    /**
     * Retrieves all addresses associated with the logged-in user.
     *
     * @param req Request object
     * @param res Response object
     */
    public async getUserAddresses(req: Request, res: Response): Promise<void> {
        // Extract user_id from request context

        const userData: UserData = req.user!;
        const user_id: number = userData.user_id;

        let connection: PoolConnection | null = null;

        try {
            connection = await getConnection();

            // Fetch all addresses associated with the user
            const resultAddresses: any = await queryDatabase(
                connection,
                "SELECT * FROM address WHERE user_id = ?",
                [user_id]
            );

            if (resultAddresses.length === 0) {
                res.status(404).json({ message: "No addresses found for the user." });
                return;
            }

            // Send the addresses as a response
            res.status(200).json(resultAddresses);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });
        } finally {
            connection?.release();
        }
    }

    public async deleteAddress(req: Request, res: Response): Promise<void> {
        const address_id: number = req.body.address_id;
        let connection: PoolConnection | null = null;

        try {
            connection = await getConnection();

            // Delete the address from the database
            const result: any = await queryDatabase(connection, "DELETE FROM address WHERE address_id = ?", [
                address_id,
            ]);

            if (result.affectedRows === 1) {
                res.status(200).json({ message: "Successfully deleted address." });
                console.log("Successfully deleted address.");
            } else {
                res.status(400).json({ message: "Failed to delete address." });
                console.log("Failed to delete address.");
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });
        } finally {
            connection?.release();
        }
    }
    public async addProduct(req: Request, res: Response): Promise<void> {
        const productType: string = req.body.productType;
        let productData: product | Game | Merchandise;
 
        if (productType === "game") {
            productData = req.body as Game;
        } else if (productType === "merchandise") {
            productData = req.body as Merchandise;
        } else {
            res.status(400).json({ message: "Invalid product type." });
            return;
        }
 
        let connection: PoolConnection | null = null;
 
        try {
            connection = await getConnection();
            await connection.beginTransaction(); // Begin a transaction
 
            // Insert common product data into the Product table
            const productResult: any = await queryDatabase(
                connection,
                "INSERT INTO Product (name, price, inventory_quantity, average_rating, category, description, image_urls) VALUES (?, ?, ?, ?, ?, ?, ?)",
 
                productData.name,
                productData.price,
                productData.inventory_quantity,
                productData.average_rating,
                productData.category,
                productData.description,
                productData.image_urls
            );
 
            // Check if the product was successfully inserted into the Product table
            if (productResult.affectedRows !== 1) {
                await connection.rollback(); // Rollback the transaction
                res.status(500).json({ message: "Failed to add product." });
                return;
            }
 
            // Get the auto-generated product_id
            const productId: number = productResult.insertId;
 
            // Insert product-specific data into the appropriate subtype table
            let subtypeResult: any;
            if (productType === "game") {
                subtypeResult = await queryDatabase(
                    connection,
                    "INSERT INTO Game (product_id, platform, release_date) VALUES (?, ?, ?)",
                    productId,
                    (productData as Game).platform,
                    (productData as Game).release_date
                );
            } else if (productType === "merchandise") {
                subtypeResult = await queryDatabase(
                    connection,
                    "INSERT INTO Merchandise (product_id, size, color) VALUES (?, ?, ?)",
                    productId,
                    (productData as Merchandise).size,
                    (productData as Merchandise).color
                );
                if (productData.game_id !== null) {
                    console.log("Product has a game_id");
                    const query: string = `
                        INSERT INTO game_merchandise (merchandise_id, game_id)
                        SELECT m.merchandise_id, ?
                        FROM product p
                        LEFT JOIN merchandise m ON p.product_id = m.product_id
                        WHERE p.product_id = ?
                        `;
                    await queryDatabase(connection, query, productData.game_id, productId);
                } else {
                    console.log("Product has no game_id");
                }
            }
 
            // Check if the product subtype data was successfully inserted
            if (subtypeResult.affectedRows !== 1) {
                await connection.rollback(); // Rollback the transaction
                res.status(500).json({ message: "Failed to add product subtype data." });
                return;
            }
 
            await connection.commit(); // Commit the transaction
            res.status(200).json({ message: "Product added successfully." });
            return;
        } catch (error) {
            console.error(error);
            await connection?.rollback(); // Rollback the transaction in case of an error
            res.status(500).json({ message: "Internal server error." });
            return;
        } finally {
            connection?.release();
        }
    }

    public async getAllProducts(_req: Request, res: Response): Promise<void> {
        let connection: PoolConnection | null = null;

        try {
            connection = await getConnection();

            const query: string = `
            SELECT p.*,
                g.game_id, g.platform, g.release_date,
                m.merchandise_id, m.size, m.color
            FROM product p
            LEFT JOIN game g ON p.product_id = g.product_id
            LEFT JOIN merchandise m ON p.product_id = m.product_id
        `;
            const resultProducts: any = await queryDatabase(connection, query);

            if (resultProducts.length === 0) {
                res.status(404).json({ message: "No products found." });
                return;
            }

            res.status(200).json(resultProducts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });
        } finally {
            connection?.release();
        }
    }

    /**
     * Deletes a product and its related entries in the Merchandise and Game tables.
     * @param req Request object
     * @param res Response object
     * @returns Promise<void>
     */
    public async deleteProduct(req: Request, res: Response): Promise<void> {
        const productId: number = req.body.productId;

        if (!productId) {
            res.status(400).json({ message: "Product ID is missing in the request." });
            return;
        }

        let connection: PoolConnection | null = null;

        try {
            connection = await getConnection();

            // Start transaction
            await connection.beginTransaction();

            // Delete the product from the product table
            const result: any = await queryDatabase(connection, "DELETE FROM product WHERE product_id = ?", [
                productId,
            ]);

            // Check if the product was deleted
            if (result.affectedRows === 0) {
                await connection.rollback(); // Rollback the transaction
                res.status(404).json({ message: "Product not found." });
                return;
            }

            // Commit the transaction
            await connection.commit();

            res.status(200).json({ message: "Product deleted successfully." });
        } catch (error) {
            // Rollback the transaction in case of an error
            if (connection) await connection.rollback();
            console.error(error);
            res.status(500).json({ message: "Internal server error." });
        } finally {
            connection?.release();
        }
    }

    public async editProduct(req: Request, res: Response): Promise<void> {
        const productId: number = req.body.productId;
        const productType: string = req.body.productType;
        let productData: Game | Merchandise;

        if (productType === "game") {
            productData = req.body as Game;
        } else if (productType === "merchandise") {
            productData = req.body as Merchandise;
        } else {
            res.status(400).json({ message: "Invalid product type." });
            return;
        }

        let connection: PoolConnection | null = null;

        try {
            connection = await getConnection();
            await connection.beginTransaction(); // Begin a transaction

            // Update common product data in the Product table
            const productResult: any = await queryDatabase(
                connection,
                "UPDATE Product SET name = ?, price = ?, inventory_quantity = ?, average_rating = ?, category = ?, description = ?, image_urls = ? WHERE product_id = ?",
                productData.name,
                productData.price,
                productData.inventory_quantity,
                productData.average_rating,
                productData.category,
                productData.description,
                productData.image_urls,
                productId
            );

            // Check if the product was successfully updated in the Product table
            if (productResult.affectedRows !== 1) {
                await connection.rollback();
                res.status(500).json({ message: "Failed to update product." });
                return;
            }

            // Update product-specific data in the appropriate subtype table
            let subtypeResult: any;
            if (productType === "game") {
                subtypeResult = await queryDatabase(
                    connection,
                    "UPDATE Game SET platform = ?, release_date = ? WHERE product_id = ?",
                    (productData as Game).platform,
                    (productData as Game).release_date,
                    productId
                );
            } else if (productType === "merchandise") {
                subtypeResult = await queryDatabase(
                    connection,
                    "UPDATE Merchandise SET size = ?, color = ? WHERE product_id = ?",
                    (productData as Merchandise).size,
                    (productData as Merchandise).color,
                    productId
                );
            }

            // Check if the product subtype data was successfully updated
            if (subtypeResult.affectedRows !== 1) {
                await connection.rollback();
                res.status(500).json({ message: "Failed to update product subtype data." });
                return;
            }

            await connection.commit(); // Commit the transaction
            res.status(200).json({ message: "Product updated successfully." });
        } catch (error) {
            console.error("Error occurred during product update:", error);
            await connection?.rollback(); // Rollback the transaction in case of an error
            res.status(500).json({ message: "Internal server error." });
        } finally {
            connection?.release();
        }
    }

    public async addReview(req: Request, res: Response): Promise<void> {
        const { product_id, review_text }: { product_id: number; review_text: string } = req.body;

        // Extract user_id from request context
        const userData: UserData = req.user!;
        const user_id: number = userData.user_id;

        // Validate if all required fields are filled in
        if (!product_id || !review_text) {
            res.status(400).json({ message: "Please provide the product ID and review text." });
            console.log("Please provide the product ID and review text.");
            return;
        }

        let connection: PoolConnection | null = null;

        try {
            connection = await getConnection();

            // Insert the review into the Review table
            const result: any = await queryDatabase(
                connection,
                "INSERT INTO Review (user_id, product_id, review_text, review_date) VALUES (?, ?, ?, ?)",
                user_id,
                product_id,
                review_text,
                new Date()
            );

            if (result.affectedRows === 1) {
                res.status(200).json({ message: "Successfully added review." });
                console.log("Successfully added review.");
            } else {
                res.status(400).json({ message: "Failed to add review. No rows affected." });
                console.log("Failed to add review. No rows affected.");
            }
        } catch (error: any) {
            console.error("Error adding review:", error);
            res.status(500).json({ message: "Internal server error.", error: error.message });
        } finally {
            connection?.release();
        }
    }

    public async getAllReviews(req: Request, res: Response): Promise<void> {
        try {
            console.log("Fetching user ID from request context...");
            const userData: UserData = req.user!;
            const user_id: number = userData.user_id;

            console.log("Establishing database connection...");
            let connection: PoolConnection | null = null;
            connection = await getConnection();

            console.log("Querying database for reviews...");
            const reviews: any[] = await queryDatabase(
                connection,
                `
                SELECT r.review_text, r.review_date, p.name 
                FROM Review r
                INNER JOIN Product p ON r.product_id = p.product_id
                WHERE r.user_id = ?
                `,
                user_id
            );

            console.log("Sending response with reviews...");
            res.status(200).json({ reviews });
        } catch (error: any) {
            console.error("Error retrieving reviews:", error);
            res.status(500).json({ message: "Internal server error.", error: error.message });
        }
    }

    public async getAllProductReviews(req: Request, res: Response): Promise<void> {
        const productId: number = parseInt(req.query.product_id as string, 10);

        if (!productId || isNaN(productId)) {
            console.log("Product ID is missing or invalid in the request URL.");
            res.status(400).json({ message: "Product ID is required and must be a valid number." });
            return;
        }

        let connection: PoolConnection | null = null;
        try {
            connection = await getConnection();
            console.log("Database connection established.");

            console.log("Querying database for reviews...");
            const reviews: any[] = await queryDatabase(
                connection,
                `SELECT r.review_text, r.review_date, u.firstName 
                FROM Review AS r
                INNER JOIN User AS u ON r.user_id = u.user_id
                WHERE r.product_id = ?`,
                productId
            );
            console.log("Database query executed.");

            console.log("Sending response with reviews...");
            res.status(200).json({ reviews });
            console.log("Response sent.");
        } catch (error: any) {
            console.error("Error retrieving reviews:", error);
            res.status(500).json({ message: "Internal server error.", error: error.message });
        } finally {
            if (connection) {
                // Release the database connection
                connection.release();
                console.log("Database connection released.");
            }
        }
    }

    public async orderComplete(req: Request, res: Response): Promise<void> {
        const user_id: number | undefined = req.user?.user_id;

        const cartItems: CartItem[] = req.body.cartItems;

        if (!cartItems || !Array.isArray(cartItems)) {
            res.status(400).json({ message: "Invalid order items." });
            return;
        }

        let connection: PoolConnection = null as any as PoolConnection;

        try {
            connection = await getConnection();

            const currentDate: Date = new Date(); // Generate current timestamp in JavaScript
            const formattedDate: string = currentDate.toISOString().slice(0, 19).replace("T", " "); // Format date to 'YYYY-MM-DD HH:MM:SS'

            const orderQuery: any = await queryDatabase(
                connection,
                "INSERT INTO `order` (user_id, status, order_date)VALUES (?)",
                [user_id, "completed", formattedDate]
            );

            const order_id: number = orderQuery.insertId;

            const orderItemPromises: Promise<any>[] = cartItems.map(async (CartItem: CartItem) => {
                const orderItemQuery: string = `
                    INSERT INTO orderitem (order_id, product_id, quantity, price, date_created)
                    VALUES (?)
                `;
                return queryDatabase(connection, orderItemQuery, [
                    order_id,
                    CartItem.product_id,
                    CartItem.quantity,
                    CartItem.price,
                    formattedDate,
                ]);
            });

            await Promise.all(orderItemPromises);

            res.status(200).json({ message: "Order placed successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });
        } finally {
            connection?.release();
        }
    }

    /**
     * @param req
     * @param res
     * @response 200 - Returns the order items for the user
     */

    public async getOrderItems(req: Request, res: Response): Promise<void> {
        const user_id: number | undefined = req.user?.user_id;

        if (user_id === undefined) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        let connection: PoolConnection = null as any as PoolConnection;

        try {
            connection = await getConnection();

            // First query to get the order ID(s) for the user
            const orderQuery: string = `
                SELECT order_id, user_id, status, order_date 
                FROM \`order\` 
                WHERE user_id = ?
            `;
            const orderResults: any = await queryDatabase(connection, orderQuery, [user_id]);

            if (orderResults.length === 0) {
                res.status(404).json({ message: "No orders found for this user." });
                return;
            }

            const orders: Order[] = orderResults;

            // Format the order IDs for the IN clause
            const orderIds: number[] = orders.map((order: any) => order.order_id);
            const formattedOrderIds: any = orderIds.join(",");

            // Second query to get all order items for the retrieved order IDs
            // and join with the product table to get the product details
            const orderItemsQuery: string = `
                SELECT oi.*, p.name, p.description, p.image_urls
                FROM orderitem oi
                JOIN product p ON oi.product_id = p.product_id
                WHERE oi.order_id IN (${formattedOrderIds})
            `;
            const orderItemsResults: OrderItemWithProduct[] = await queryDatabase(
                connection,
                orderItemsQuery
            );

            // Group order items by order ID and add them to the corresponding order
            orders.forEach((order) => {
                order.items = orderItemsResults.filter((item) => item.order_id === order.order_id);
                order.total_price = order.items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            });

            res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });
        } finally {
            connection?.release();
        }
    }

    /**
     * @param req
     * @param res
     *
     * @response 200 - Returns message that the cart is empty
     */

    public async emptyCart(req: Request, res: Response): Promise<void> {
        const cart_id: number = req.body.cart_id;

        let connection: PoolConnection | null = null;

        try {
            connection = await getConnection();

            const result: any = await queryDatabase(connection, "DELETE FROM cartitem WHERE cart_id = ?", [
                cart_id,
            ]);

            if (result.affectedRows === 0) {
                res.status(400).json({ message: "No cart items found with this cart_id." });
                return;
            }

            res.status(200).json({ message: "Successfully removed all items from cart." });
        } catch (error) {
        } finally {
        }
    }
}
