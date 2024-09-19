import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { UserService } from "../services/UserService";

interface Product {
    product_id: number;
    image_urls: string;
    name: string;
    description: string;
    price: number;
    inventory_quantity: number;
    average_rating: number;
    category: string;
}

export type UserCartResponse = {
    cart_id?: number;
    email: string;
    cartItems:
        | {
              cart_item_id: number;
              product_id: number;
              name: string;
              price: number;
              description: string;
              image_urls: string;
              quantity: number;
          }[]
        | undefined;
};

/**
 * @element search-page
 * @extends LitElement
 *
 * This component represents a search bar displaying filtered products.
 */
@customElement("search-page")
export class SearchBar extends LitElement {
    private products: Product[] = [];

    @property({ type: Function })
    public navigateToProductPage!: (product: Product) => void;

    @property({ type: Array })
    public games: Product[] = [];

    private userService: UserService = new UserService();

    public static styles = css`
        /* The search field */
        #myInput {
            box-sizing: border-box;
            background-image: url('/assets/img/searchicon.png');
            background-position: 14px 12px;
            background-repeat: no-repeat;
            font-size: 16px;
            padding: 14px 20px 12px 45px;
            border-radius: 6px;
            border: 1px solid grey;
        }

        /* The search field when it gets focus/clicked on */
        #myInput:focus {
            outline: 3px solid #ddd;
        }

        .popup {
            display: none;
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            z-index: 1000;
            border-radius: 6px;
        }

        .popup-content {
            max-height: 70vh;
            overflow-y: auto;
        }

        .close {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
        }

        .product-item img {
            max-width: 100%;
            max-height: 200px; /* Limit the height of the images */
            margin-bottom: 10px;
        }

        .view-details-button {
            background-color: green;
            border: none;
            border-radius: 4px;
            padding: 10px 20px;
            font-size: 16px;
            color: white;
            cursor: pointer;
        }

        .nav-link {
            background-color: #fff;
            color: #666;
            font-size: 14px;
            padding: 5px 20px;
            border-radius: 8px;
            text-decoration: none;
            transition: background-color 0.3s;
            margin: 0 10px;
        }

        .nav-link:hover,
        .nav-link.active {
            background-color: #007bff;
            color: #fff;
        }
    `;

    private async handleSearch(): Promise<void> {
        const input: HTMLInputElement | null = this.shadowRoot?.querySelector("#myInput") ?? null;
        if (!input) return;

        const searchText: string = input.value.trim().toLowerCase();
        console.log("Searching for:", searchText);

        try {
            const response: any | undefined = await this.userService.searchProduct(searchText);
            console.log("Response from service:", response);

            if (response && Array.isArray(response)) {
                // Filter products by name
                const filteredProducts: Product[] = response
                    .filter((product) => product.name.toLowerCase().includes(searchText))
                    .map((product) => ({
                        product_id: product.product_id,
                        image_urls: product.image_urls,
                        name: product.name,
                        description: product.description,
                        price: parseFloat(product.price),
                        inventory_quantity: product.inventory_quantity,
                        average_rating: parseFloat(product.average_rating),
                        category: product.category || "",
                    }));
                this.products = filteredProducts;
                console.log("Products found:", this.products);
                this.openPopup();
            } else {
                this.products = []; // Set to empty array if response is not nice
                console.log("No products found or invalid response format");
            }

            this.requestUpdate(); // Trigger an update to render the filtered products
        } catch (error) {
            console.error("Error fetching products:", error);
            this.products = []; // Clear products in case of error
            this.requestUpdate(); // Ensure the UI updates
        }
    }

    private renderFilteredProducts(): TemplateResult {
        return html`
            ${this.products.map(
                (product) => html`
                    <div class="product-item">
                        <img src="${product.image_urls}" alt="${product.name}" />
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <span>€: ${product.price}</span>
                        <br>
                        <button
                            class="view-details-button"
                            @click=${(): void => {
                                this.navigateToProductPage(product);
                                this.closePopup(); // Close the popup
                            }}
                        >
                            View details
                        </button>
                        <hr>
                    </div>
                `
            )}
        `;
    }

    private openPopup(): void {
        const popup: any = this.shadowRoot?.getElementById("popup");
        if (popup) {
            popup.style.display = "block";
        }
    }

    private closePopup(): void {
        const popup: any = this.shadowRoot?.getElementById("popup");
        if (popup) {
            popup.style.display = "none";
        }
    }

    public render(): TemplateResult {
        return html`
            <div id="myDropdown" class="dropdown-content">
                <input type="text" placeholder="Search.." id="myInput" />
                <button class="nav-link" @click="${this.handleSearch}">Search</button>
            </div>
            <div class="popup" id="popup">
                <div class="popup-content">
                    <span class="close" @click="${this.closePopup}">&times;</span>
                    ${this.renderFilteredProducts()}
                </div>
            </div>
        `;
    }
}
