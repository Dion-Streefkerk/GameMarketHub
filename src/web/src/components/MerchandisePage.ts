import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { OrderItem } from "@shared/types/OrderItem";
import { WishItem } from "@shared/types";

/**
 * @element merchandise-page
 * @extends LitElement
 *
 * This component represents a merchandise page displaying all available merchandise items.
 */
@customElement("merchandise-page")
export class MerchandisePageComponent extends LitElement {
    /**
     * Styles for the merchandise page component.
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

        .order-button:hover {
            background-color: #45a049;
        }

        .view-details-button:hover {
            background-color: #0056b3;
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
    public merchandiseItems: OrderItem[] = [];

    @property({ type: Function })
    public addItemToCart!: (orderItem: OrderItem) => Promise<void>;

    @property({ type: Function })
    public addItemToWishlist!: (wishItem: WishItem) => Promise<void>;

    @property({ type: Function })
    public navigateToProductPage!: (orderItem: OrderItem) => void;

    @state()
    private sortAscending: boolean = true;

    private async handleAddToCartClick(item: OrderItem): Promise<void> {
        console.log("Adding item to cart:");
        await this.addItemToCart(item);
    }

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
     * Sorts the merchandise items by price.
     */
    private sortItemsByPrice(): void {
        this.merchandiseItems = [...this.merchandiseItems].sort((a, b) => {
            return this.sortAscending ? a.price - b.price : b.price - a.price;
        });
        this.sortAscending = !this.sortAscending;
    }

    /**
     * Renders the merchandise page component.
     * @returns {TemplateResult} The rendered HTML template.
     */
    public render(): TemplateResult {
        return html`
            <h1>View the merchandise from the webshop here</h1>
            <button class="sort-button" @click=${this.sortItemsByPrice}>
                Sort by price ${this.sortAscending ? "▲" : "▼"}
            </button>

            ${this.merchandiseItems.length === 0
                ? html`<p>Loading... Please wait.</p>`
                : html`
                      <div class="order-items">
                          ${this.merchandiseItems.map(
                              (item) => html`
                                  <div class="order-item">
                                      <img src="${item.image_urls}" alt="${item.name}" />
                                      <h2>${item.name}</h2>
                                      <p>${this.truncateText(item.description, 200)}</p> <!-- Shortened description -->
                                      <p class="order-item-price">&euro; ${item.price}</p>
                                      <div class="order-buttons">
                                          <button
                                              class="order-button"
                                              @click=${(): Promise<void> => this.handleAddToCartClick(item)}
                                          >
                                              Add to Cart
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
                          )}
                      </div>
                  `}
        `;
    }
}
