import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { OrderItem } from "@shared/types/OrderItem"; // Adjust the path as necessary
import { WishItem } from "@shared/types";

/**
 * @element games-page
 * @extends LitElement
 *
 * This component represents a games page displaying all available games.
 */
@customElement("games-page")
export class GamesPageComponent extends LitElement {
    /**
     * Styles for the games page component.
     * @internal
     */
    public static styles = css`
        .order-items {
            display: flex;
            flex-wrap: wrap;
            gap: 20px; /* Space between items */
            justify-content: center;
        }

        .order-item {
            flex: 1 1 calc(25% - 20px); /* Four items per row */
            box-sizing: border-box;
            border: 1px solid #e0e0e0; /* Optional: to make items more distinct */
            border-radius: 10px;
            padding: 15px;
            background: #fff; /* Background color */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            text-align: center; /* Center content inside each item */
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .order-item:hover {
            transform: translateY(-10px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .order-item img {
            width: 100%; /* Make images responsive */
            height: 500px;
            object-fit: cover; /* Maintain aspect ratio and cover the area */
            border-radius: 10px;
            margin-bottom: 10px;
        }

        .order-item h2 {
            font-size: 18px;
            margin: 10px 0;
            color: #333;
        }

        .order-item p {
            font-size: 14px;
            color: #777;
            margin: 10px 0;
        }

        .order-item-price {
            font-size: 16px;
            font-weight: bold;
            margin: 10px 0;
        }

        .order-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .order-button,
        .view-details-button {
            background-color: #4caf50; /* Green */
            border: none;
            color: white;
            padding: 10px;
            font-size: 14px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .view-details-button {
            background-color: #007bff;
        }

        .order-button:hover {
            background-color: #45a049;
        }

        .view-details-button:hover {
            background-color: #0056b3;
        }

        .wishlist-button {
            background-color: orange;
            border: none;
            color: white;
            padding: 10px;
            font-size: 14px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease 0s;
        }

        .sort-button {
            background-color: #f0ad4e; /* Yellow */
            border: none;
            color: white;
            padding: 10px;
            font-size: 14px;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 20px;
            transition: background-color 0.3s ease;
        }

        .sort-button:hover {
            background-color: #ec971f;
        }


        @media (max-width: 1200px) {
            .order-item {
                flex: 1 1 calc(33.33% - 20px); /* Three items per row for medium screens */
            }
        }

        @media (max-width: 992px) {
            .order-item {
                flex: 1 1 calc(50% - 20px); /* Two items per row for smaller screens */
            }
        }

        @media (max-width: 768px) {
            .order-item {
                flex: 1 1 100%; /* One item per row for mobile screens */
            }
        }
    `;

    @property({ type: Array })
    public games: OrderItem[] = [];

    @property({ type: Function })
    public addItemToCart!: (orderItem: OrderItem) => Promise<void>;

    @property({ type: Function })
    public addItemToWishlist!: (wishItem: WishItem) => Promise<void>;

    @property({ type: Function })
    public navigateToProductPage!: (orderItem: OrderItem) => void;

    @state()
    private sortAscending: boolean = true;

    /**
     * Truncates a string to a specified length and adds ellipsis if it exceeds that length.
     *
     * @param text The text to truncate.
     * @param maxLength The maximum length of the truncated text.
     * @returns The truncated text with ellipsis if it was truncated.
     */
    private truncateText(text: any, maxLength: number): string {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + "...";
    }

    /**
     * Converts an OrderItem to a WishItem.
     * @param orderItem The OrderItem to convert.
     * @returns The converted WishItem.
     */
    private convertToWishlistItem(orderItem: OrderItem): WishItem {
        return {
            wishlist_id: 0,
            product_id: orderItem.product_id // assuming 'id' is the correct property for product ID
        };
    }
    /**
     * Sorts the games by price.
     */

    private sortGamesByPrice(): void {
        this.games = [...this.games].sort((a, b) => {
            return this.sortAscending ? a.price - b.price : b.price - a.price;
        });
        this.sortAscending = !this.sortAscending;
    }

    /**
     * Renders the list of game order items.
     * @returns {TemplateResult} The template result containing the HTML to render.
     */
    public render(): TemplateResult {
        const gameItems: TemplateResult[] = this.games.map(
            (item) => html`
                <div class="order-item">
                    <img src="${item.image_urls}" alt="${item.name}" />
                    <h2>${item.name}</h2>
                    <p>${this.truncateText(item.description, 200)}</p>
                    <!-- Shortened description -->
                    <div class="order-item-price">€ ${item.price}</div>
                    <div class="order-buttons">
                        <button class="order-button" @click=${(): Promise<void> => this.addItemToCart(item)}>
                            Add to cart
                        </button>
                        <button
                            class="view-details-button"
                            @click=${(): void => this.navigateToProductPage(item)}
                        >
                            View details
                        </button>
                        <button class="wishlist-button"  @click=${(): Promise<void> => this.addItemToWishlist(this.convertToWishlistItem(item))}>
                            Add to wishlist
                        </button>
                    </div>
                </div>
            `
        );

        return html`
            <h1>Games</h1>
            <button class="sort-button" @click=${this.sortGamesByPrice}>
                Sort by price ${this.sortAscending ? "▲" : "▼"}
            </button>
            <div class="order-items">
                ${gameItems.length === 0 ? html`<div>Loading... Please wait.</div>` : gameItems}
            </div>
        `;
    }
}
