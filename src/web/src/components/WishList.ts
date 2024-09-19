import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { UserService } from "../services/UserService";
import { UserWishlistResponse } from "@shared/responses/UserWishlistResponse";
import { WishListItem } from "@shared/types";

@customElement("wish-list")
export class WishList extends LitElement {
    @property({ type: Boolean }) public isLoggedIn = false;
    @property({ type: Function }) public navigateToCheckout!: (totalPrice: number, wishlistItems: WishListItem[]) => void;
    @state() private wishlistItems: WishListItem[] = [];
    // @state() private totalPrice: number = 0;
    private userService: UserService = new UserService();

    public static styles = css`

        .wishlist-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            margin-top: 50px;
        }


        .wishlist-header {
            text-align: center;
            margin-bottom: 20px;
            font-family: "Arial", sans-serif;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Adjust values as needed */
        }

        .wishlist-header-img {
            width: 150px;
            margin-left: 467px;
            margin-bottom: 20px;
        }

        .wishlist-items {
            width: 100%;
        }

        .wishlist-item {
            display: flex;
            flex-direction: column;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 10px;
            background-color: #fff;
            transition: box-shadow 0.3s ease;
        }

        .wishlist-item:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .wishlist-item-image {
            width: 100%;
            max-width: 200px;
            height: auto;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 10px;
        }

        .wishlist-item-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }

        .wishlist-item-info {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            margin-right: 20px;
        }

        .wishlist-item-name {
            font-size: 18px;
            font-weight: bold;
            margin: 5px 0;
        }

        .wishlist-item-description {
            font-size: 14px;
            color: #555;
            margin: 5px 0;
        }

        .wishlist-item-price {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin: 5px 0;
        }

        .wishlist-item-remove {
            width: 24px;
            height: 24px;
            cursor: pointer;
            margin: 5px 0;
        }

        .wishlist-total {
            width: 100%;
            max-width: 800px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 2px solid #ccc;
            padding-top: 20px;
            margin-top: 20px;
        }

        .wishlist-total h3 {
            font-size: 1.5rem;
            font-weight: bold;
        }

        .checkout-button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.3s ease;
        }

        .checkout-button:hover {
            background-color: #0056b3;
        }

        @media (min-width: 768px) {
            .wishlist-item {
                flex-direction: row;
            }

            .wishlist-item-image {
                margin-right: 20px;
            }

            .wishlist-item-details {
                align-items: flex-start;
            }
        }
    `;

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        if (this.isLoggedIn) {
            await this.loadWishlistItems();
        }
    }

    private async loadWishlistItems(): Promise<void> {
        const result: UserWishlistResponse | undefined = await this.userService.getWishlist();
        if (result) {
            this.wishlistItems = result.wishlistItems || [];
            // this.totalPrice = this.calculateTotal(this.wishlistItems);
        }
    }

    // private calculateTotal(wishlistItems: WishListItem[]): number {
    //     return wishlistItems.reduce((total, item) => total + item.price * item.quantity, 0);
    // }

    private async deleteItemFromWishlist(productItemId: number): Promise<void> {
        if (confirm("Are you sure you want to delete this item from your wishlist?")) {
            await this.userService.removeItemFromWishlist(productItemId);
            await this.loadWishlistItems();
        }
    }
    // private async deleteItemFromWishlist(productItemId: number): Promise<void> {
    //     if (confirm("Are you sure you want to delete this item from your wishlist?")) {
    //         const response: any = await this.userService.removeItemFromWishlist(productItemId);
    //         if (response.ok) {
    //             await this.loadWishlistItems();
    //         } else {
    //             const errorData: any = await response.json();
    //             console.error("Error removing item from wishlist:", errorData.message);
    //         }
    //     }
    // }

    public render(): TemplateResult {
        return html`
                <h1 class="wishlist-header">Wish List</h1>
                <div class="wishlist-content">
                    <div class="wishlist-items">
                        ${this.wishlistItems.map(
                            (item) => html`
                                <div class="wishlist-item">
                                    <img src="${item.image_urls}" alt="${item.name}" class="wishlist-item-image" />
                                    <div class="wishlist-item-details">
                                        <div class="wishlist-item-info">
                                            <p class="wishlist-item-name">${item.name}</p>
                                            <p class="wishlist-item-description">${item.description}</p>
                                        </div>
                                        <div>
                                            
                                            <img
                                                class="wishlist-item-remove"
                                                src="/assets/img/trash.png"
                                                @click=${(): Promise<void> => this.deleteItemFromWishlist(item.product_id)}
                                            />
                                            <p>${item.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            `
                        )}
                    </div>
                    <div class="wishlist-total">
                        
                    </div>
                </div>
        `;
    }
}