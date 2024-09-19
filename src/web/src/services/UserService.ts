import { UserLoginFormModel } from "@shared/formModels/UserLoginFormModel";
import { UserRegisterFormModel } from "@shared/formModels/UserRegisterFormModel";
import { TokenService } from "./TokenService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { Order, OrderItem, UserData } from "@shared/types";
import { UserCartResponse } from "@shared/responses/UserCartResponse";
import { Address } from "@shared/types/Address";
import { product } from "@shared/types/product";
import { Game } from "@shared/types/Game";
import { Merchandise } from "@shared/types/Merchandise";
import { CartItem } from "@shared/types"; // Import the cartItem type
import { UserWishlistResponse } from "@shared/responses/UserWishlistResponse";
import { WishItem } from "@shared/types";

const headers: { "Content-Type": string } = {
    "Content-Type": "application/json",
};

/**
 * Handles user related functionality
 */
export class UserService {
    private _tokenService: TokenService = new TokenService();

    /**
     * Handles user login
     *
     * @param formData - Data to use during login
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async login(formData: UserLoginFormModel): Promise<boolean> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/login`, {
            method: "post",
            headers: headers,
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            console.error(response);

            return false;
        }

        const json: { token: string | undefined } = await response.json();

        if (json.token) {
            this._tokenService.setToken(json.token);

            return true;
        }

        return false;
    }

    /**
     * Handles user registration
     *
     * @param formData - Data to use during registration
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async register(formData: UserRegisterFormModel): Promise<boolean> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/register`, {
            method: "post",
            headers: headers,
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            console.error(response);

            return false;
        }

        return true;
    }

    /**
     * Handles user logout
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async logout(): Promise<boolean> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return false;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/logout`, {
            method: "get",
            headers: { ...headers, authorization: token },
        });

        if (!response.ok) {
            console.error(response);

            return false;
        }

        return true;
    }

    /**
     * Handles user welcome message containing user and cart data. Requires a valid token.
     *
     * @returns Object with user and cart data when successful, otherwise `undefined`.
     */
    public async getWelcome(): Promise<UserHelloResponse | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/hello`, {
            method: "get",
            headers: { ...headers, authorization: token },
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as UserHelloResponse;
    }

    public async getWishlist(): Promise<UserWishlistResponse | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/getWishlist`, {
            method: "get",
            headers: { ...headers, authorization: token },
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as UserWishlistResponse;
    }

    public async searchProduct(allProducts: string): Promise<UserCartResponse | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}products?name=${allProducts}`, {
                method: "GET",
                headers: { ...headers, authorization: token },
            });

            if (!response.ok) {
                console.error(response);
                return undefined;
            }

            return (await response.json()) as UserCartResponse;
        } catch (error) {
            console.error("Error fetching products:", error);
            return undefined;
        }
    }

    /**
     * Handles adding an order item to the wishlist of the current user. Requires a valid token.
     *
     * @returns Current number of order items in the cart when successful, otherwise `false`.
     */
    public async addItemToWishlist(wishItem: WishItem): Promise<number | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/wishlist/`, {
            method: "post",
            headers: { ...headers, authorization: token },
            body: JSON.stringify(wishItem),
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as number;
    }

    /**
     * Handles removing an order item from the wishlist of the current user. Requires a valid token.
     *
     * @returns if the item was removed correctly.
     */
    public async removeItemFromWishlist(productItemId: number): Promise<number | undefined> {
        const token: string | undefined = this._tokenService.getToken();
        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/delete`, {
            method: "post",
            headers: { ...headers, authorization: token },
            body: JSON.stringify({ product_id: productItemId }),
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as number;
    }

    public async getCart(): Promise<UserCartResponse | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/getCart`, {
            method: "get",
            headers: { ...headers, authorization: token },
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as UserCartResponse;
    }

    /**
     * Handles adding an order item to the cart of the current user. Requires a valid token.
     *
     * @returns Current number of order items in the cart when successful, otherwise `false`.
     */
    public async addOrderItemToCart(orderItem: OrderItem): Promise<number | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/cart/`, {
            method: "post",
            headers: { ...headers, authorization: token },
            body: JSON.stringify(orderItem),
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as number;
    }

    /**
     * Handles removing an order item from the cart of the current user. Requires a valid token.
     *
     * @returns if the item was removed correctly.
     */
    public async removeOrderItemFromCart(cartItemId: number): Promise<number | undefined> {
        const token: string | undefined = this._tokenService.getToken();
        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/cart/delete`, {
            method: "post",
            headers: { ...headers, authorization: token },
            body: JSON.stringify({ cartItemId }),
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as number;
    }
    /**
     * Handles updating the quantity of a cart item. Requires a valid token.
     *
     * @param cartItemId - The ID of the cart item to update
     * @param newQuantity - The new quantity for the cart item
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async updateCartItemQuantity(cartItemId: number, newQuantity: number): Promise<boolean> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return false;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/cart/update`, {
            method: "post",
            headers: { ...headers, authorization: token },
            body: JSON.stringify({ cartItemId, newQuantity }),
        });

        if (!response.ok) {
            console.error(response);

            return false;
        }

        return true;
    }

    /**
     * Handles user subscription to the newsletter.
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async updateNewsletterStatus(status: boolean): Promise<void> {
        const token: string | undefined = this._tokenService.getToken();
        if (!token) {
            throw new Error("No token available");
        }
        const response: Response = await fetch(`${viteConfiguration.API_URL}updateNewsletterStatus`, {
            method: "post",
            headers: { ...headers, authorization: token },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error("Failed to update newsletter subscription status");
        }
    }

    /**
     * Retrieves all user information from the server.
     * @returns A list of all user information when successful, otherwise `undefined`.
     */
    public async getAllUserInfo(): Promise<UserData[] | undefined> {
        const token: string | undefined = this._tokenService.getToken();
        if (!token) {
            return undefined;
        }
        const response: Response = await fetch(`${viteConfiguration.API_URL}getAllUserInfo`, {
            method: "get",
            headers: { ...headers, authorization: token },
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as UserData[];
    }

    /**
     * Retrieves all users' information from the server.
     * @returns A list of all users' information when successful, otherwise `undefined`.
     */
    public async getAllUsers(): Promise<UserData[] | undefined> {
        const token: string | undefined = this._tokenService.getToken();
        if (!token) {
            return undefined;
        }
        const response: Response = await fetch(`${viteConfiguration.API_URL}getAllUsers`, {
            method: "get",
            headers: { ...headers, authorization: token },
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as UserData[];
    }

    /**
     * Changes user data on the server.
     * Requires a valid token.
     * @param newData - New data to update for the user.
     * @returns The updated user data when successful, otherwise `undefined`.
     */
    public async changeUserData(newData: {
        email: string;
        firstName: string;
        lastName: string;
        newsletter_status: any;
    }): Promise<UserData | undefined> {
        const token: string | undefined = this._tokenService.getToken();
        if (!token) {
            return undefined;
        }

        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/info/update`, {
                method: "post",
                headers: { ...headers, authorization: token },
                body: JSON.stringify(newData),
            });

            if (!response.ok) {
                console.error(response);
                return undefined;
            }

            const updatedUserData: UserData = (await response.json()) as UserData;
            return updatedUserData;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    /**
     * Updates the role of a user on the server.
     * Requires a valid token.
     * @param userId - The ID of the user whose role is to be updated.
     * @param authorization_level_id - The new authorization level ID.
     * @returns `true` when successful, otherwise `false`.
     */
    public async updateRole(userId: number, authorization_level_id: number): Promise<boolean> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return false;
        }

        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}updateRole`, {
                method: "post",
                headers: { ...headers, Authorization: token },
                body: JSON.stringify({ userId, authorization_level_id }),
            });

            if (!response.ok) {
                console.error(response);
                return false;
            }

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * Deletes a user from the server.
     * Requires a valid token.
     * @param userId - The ID of the user to be deleted.
     * @returns `true` when successful, otherwise `false`.
     */
    public async deleteUser(userId: number): Promise<boolean> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return false;
        }

        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}deleteUser`, {
                method: "post",
                headers: { ...headers, Authorization: token },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                console.error(response);
                return false;
            }

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    public async addAddress(Address: Address): Promise<boolean> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return false;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/addAddress`, {
            method: "post",
            headers: { ...headers, authorization: token },
            body: JSON.stringify(Address),
        });

        if (!response.ok) {
            console.error(response);

            return false;
        }

        return true;
    }
    /**
     * Retrieves all addresses of the current user from the server.
     * Requires a valid token.
     * @returns A list of all addresses when successful, otherwise `undefined`.
     */
    public async getAddresses(): Promise<Address[] | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/getAddresses`, {
            method: "get",
            headers: { ...headers, authorization: token },
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as Address[];
    }

    /**
     * Edits an existing address for the current user on the server.
     * Requires a valid token.
     * @param addressId - The ID of the address to be edited.
     * @param updatedAddress - The updated address information.
     * @returns `true` when successful, otherwise `false`.
     */
    public async editAddress(updatedAddress: Address): Promise<boolean> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return false;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/editAddress`, {
            method: "post",
            headers: { ...headers, authorization: token },
            body: JSON.stringify(updatedAddress),
        });

        if (!response.ok) {
            console.error(response);
            return false;
        }

        return true;
    }

    /**
     * Deletes an existing address for the current user on the server.
     * Requires a valid token.
     * @param addressId - The ID of the address to be deleted.
     * @returns `true` when successful, otherwise `false`.
     */
    public async deleteAddress(address_id: number): Promise<boolean> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return false;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}deleteAddress`, {
            method: "post",
            headers: { ...headers, authorization: token },
            body: JSON.stringify({ address_id }),
        });

        if (!response.ok) {
            console.error(response);
            return false;
        }

        return true;
    }

    public async addProduct(productData: product | Game | Merchandise): Promise<boolean> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return false;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}addProduct`, {
            method: "post",
            headers: { "Content-Type": "application/json", authorization: token },
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            console.error(response);
            return false;
        }

        return true;
    }

    /**
     * Retrieves all products from the server.
     * Requires a valid token.
     * @returns A list of all products when successful, otherwise `undefined`.
     */
    public async getAllProducts(): Promise<(product | Game | Merchandise)[] | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}products`, {
            method: "get",
            headers: { ...headers, authorization: token },
        });

        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        return (await response.json()) as (product | Game | Merchandise)[];
    }

    /**
     * Deletes a product from the server.
     * Requires a valid token.
     * @param productId - The ID of the product to be deleted.
     * @returns `true` when successful, otherwise `false`.
     */
    public async deleteProduct(productId: number): Promise<boolean> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return false;
        }

        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}deleteProduct`, {
                method: "post",
                headers: { ...headers, authorization: token },
                body: JSON.stringify({ productId }),
            });

            if (!response.ok) {
                console.error(response);
                return false;
            }

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * Edits an existing product on the server.
     * Requires a valid token.
     * @param productId - The ID of the product to be edited.
     * @param updatedProduct - The updated product information.
     * @returns `true` when successful, otherwise `false`.
     */
    public async editProduct(productId: number, updatedProduct: Game | Merchandise): Promise<boolean> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return false;
        }

        // Ensure productId is included in the request body
        const requestBody: any = { productId, ...updatedProduct };

        const response: Response = await fetch(`${viteConfiguration.API_URL}editProduct`, {
            method: "post",
            headers: { "Content-Type": "application/json", Authorization: token },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            console.error(response);
            return false;
        }

        return true;
    }

    public async addReview(product_id: number, review_text: string): Promise<boolean> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return false;
        }

        const reviewData: any = { product_id, review_text };

        const response: Response = await fetch(`${viteConfiguration.API_URL}addReview`, {
            method: "post",
            headers: { ...headers, authorization: token, "Content-Type": "application/json" },
            body: JSON.stringify(reviewData), // Send review data including review_date
        });

        if (!response.ok) {
            console.error(response);
            return false;
        }

        return true;
    }

    public async fetchUserReviews(): Promise<any[]> {
        try {
            const token: string | undefined = this._tokenService.getToken();

            if (!token) {
                throw new Error("Token not available.");
            }

            const response: Response = await fetch(`${viteConfiguration.API_URL}getAllReviews`, {
                method: "get",
                headers: { ...headers, authorization: token },
            });

            if (!response.ok) {
                console.error("Failed to fetch reviews:", response.statusText);
                throw new Error("Failed to fetch reviews.");
            }

            const responseData: any = await response.json();
            const reviewsData: any[] = responseData.reviews || [];

            if (reviewsData.length === 0) {
                console.log("User hasn't written any reviews yet.");
                return [];
            }

            // Assuming your API response contains product_name, review_text, and review_date fields
            const formattedReviews: any[] = reviewsData.map((review: any) => ({
                name: review.name,
                review_text: review.review_text,
                review_date: review.review_date,
            }));

            return formattedReviews;
        } catch (error) {
            console.error("Error fetching reviews:", error);
            return [];
        }
    }

    public async getAllProductReviews(productId: number): Promise<any[]> {
        const token: string | undefined = this._tokenService.getToken();

        try {
            console.log("Fetching product reviews...");

            if (!token) {
                throw new Error("Token not available.");
            }

            const response: Response = await fetch(
                `${viteConfiguration.API_URL}getAllProductReviews?product_id=${productId}`,
                {
                    method: "get",
                    headers: { ...headers, authorization: token },
                }
            );

            if (!response.ok) {
                console.error("Failed to fetch reviews:", response.statusText);
                throw new Error("Failed to fetch reviews.");
            }

            const responseData: any = await response.json();
            const reviewsData: any[] = responseData.reviews || [];

            if (reviewsData.length === 0) {
                console.log("No reviews available for this product.");
                return [];
            }

            // Assuming your API response contains product_name, review_text, and review_date fields
            const formattedReviews: any[] = reviewsData.map((review: any) => ({
                name: review.firstName,
                review_text: review.review_text,
                review_date: review.review_date,
            }));

            return formattedReviews;
        } catch (error) {
            console.error("Error fetching reviews:", error);
            return [];
        }
    }

    public async orderComplete(cartItems: CartItem[]): Promise<boolean> {
        const token: string | undefined = this._tokenService.getToken();
        if (!token) {
            return false;
        }

        const requestBody: any = { cartItems: cartItems };

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/orderComplete`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                authorization: token,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            console.error(response);
            return false;
        }

        return true;
    }

    /**
     * get all the order items from the server
     *
     * @returns A list of all order items when successful, otherwise `undefined`.
     * */
    public async getOrderItems(): Promise<Order[] | undefined> {
        const token: string | undefined = this._tokenService.getToken();
        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/getOrders`, {
            method: "get",
            headers: { ...headers, authorization: token },
        });

        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        return (await response.json()) as Order[];
    }

    /**
     * Empties the current user's cart on the server.
     * Requires a valid token.
     * @returns `true` when successful, otherwise `false`.
     */
    public async emptyCart(cart_id: number): Promise<boolean> {
        const token: string | undefined = this._tokenService.getToken();
        if (!token) {
            return false;
        }

        const requestBody: any = { cart_id };

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/emptyCart`, {
            method: "post",
            headers: { ...headers, authorization: token },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            console.error(response);
            return false;
        }

        return true;
    }
}
