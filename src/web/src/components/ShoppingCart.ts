import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { UserService } from "../services/UserService";
import { UserCartResponse } from "@shared/responses/UserCartResponse";
import { CartItem } from "@shared/types";

@customElement("shopping-cart")
export class ShoppingCart extends LitElement {
    @property({ type: Boolean }) public isLoggedIn = false;
    @property({ type: Function }) public navigateToCheckout!: (
        totalPrice: number,
        cartitems: CartItem[],
        cart_id: number
    ) => void;
    @state() private cartItems: CartItem[] = [];
    @state() private totalPrice: number = 0;
    @state() private cart_Id: number = 0;
    @state() private _cartItemsCount: number = 0;
    private userService: UserService = new UserService();

    public static styles = css`
        .cart-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        .cart-items {
            width: 100%;
        }

        .cart-item {
            display: flex;
            flex-direction: column;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 10px;
            background-color: #fff;
            transition: box-shadow 0.3s ease;
        }

        .cart-item:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .cart-item-image {
            width: 100%;
            max-width: 200px;
            height: auto;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 10px;
        }

        .cart-item-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }

        .cart-item-info {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            margin-right: 20px;
        }

        .cart-item-name {
            font-size: 18px;
            font-weight: bold;
            margin: 5px 0;
        }

        .cart-item-description {
            font-size: 14px;
            color: #555;
            margin: 5px 0;
        }

        .cart-item-price {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin: 5px 0;
        }

        .cart-item-remove {
            width: 24px;
            height: 24px;
            cursor: pointer;
            margin: 5px 0;
        }

        .cart-item select {
            padding: 5px;
            margin-top: 5px;
        }

        .cart-total {
            width: 100%;
            max-width: 800px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 2px solid #ccc;
            padding-top: 20px;
            margin-top: 20px;
        }

        .order-button {
            background-color: #4caf50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
        }

        .order-button:hover {
            background-color: #45a049;
        }

        @media (min-width: 768px) {
            .cart-item {
                flex-direction: row;
            }

            .cart-item-image {
                margin-right: 20px;
            }

            .cart-item-details {
                align-items: flex-start;
            }
        }
    `;

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        if (this.isLoggedIn) {
            await this.loadCartItems();
        }
    }

    private async loadCartItems(): Promise<void> {
        const result: UserCartResponse | undefined = await this.userService.getCart();
        if (result) {
            this.cartItems = result.cartItems || [];
            this.cart_Id = result.cart_id || 0;
            this.totalPrice = this.calculateTotal(this.cartItems);
            this._cartItemsCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
            console.log("Cart items loaded:", this._cartItemsCount); // Log the cart items count
            const event: any = new CustomEvent("cartUpdated", {
                detail: { cartItemsCount: this._cartItemsCount },
            });
            window.dispatchEvent(event);
        }
    }

    private calculateTotal(cartItems: CartItem[]): number {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    private async updateQuantity(cartItemId: number, newQuantity: number): Promise<void> {
        console.log("updateQuantity called");
        await this.userService.updateCartItemQuantity(cartItemId, newQuantity).catch(console.error);
        await this.loadCartItems();
    }

    private async deleteItemFromCart(cartItemId: number): Promise<void> {
        console.log("deleteItemFromCart called");
        if (confirm("Are you sure you want to delete this item from your cart?")) {
            await this.userService.removeOrderItemFromCart(cartItemId).catch(console.error);
            await this.loadCartItems();
        }
    }

    private CheckIfCartIsEmpty(): void {
        if (this._cartItemsCount === 0) {
            alert("Your cart is empty");
        } else {
            this.navigateToCheckout(this.totalPrice, this.cartItems, this.cart_Id);
        }
    }

    public render(): TemplateResult {
        return html`
            <h1>Shopping Cart</h1>
            <div class="cart-content">
                <div class="cart-items">
                    ${this.cartItems.map(
                        (item) => html`
                            <div class="cart-item">
                                <img src="${item.image_urls}" alt="${item.name}" class="cart-item-image" />
                                <div class="cart-item-details">
                                    <div class="cart-item-info">
                                        <p class="cart-item-name">${item.name}</p>
                                        <p class="cart-item-description">${item.description}</p>
                                    </div>
                                    <div>
                                        <p class="cart-item-price">€${item.price}</p>
                                        <img
                                            class="cart-item-remove"
                                            src="/assets/img/trash.png"
                                            @click=${(): Promise<void> =>
                                                this.deleteItemFromCart(item.cart_item_id)}
                                        />

                                        <select
                                            @change=${(e: Event): Promise<void> =>
                                                this.updateQuantity(
                                                    item.cart_item_id,
                                                    Number((e.target as HTMLSelectElement).value)
                                                )}
                                        >
                                            ${Array.from({ length: 10 }, (_, i) => i + 1).map(
                                                (quantity) => html`
                                                    <option
                                                        value="${quantity}"
                                                        ?selected=${quantity === item.quantity}
                                                    >
                                                        ${quantity}
                                                    </option>
                                                `
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        `
                    )}
                </div>
                <div class="cart-total">
                    <h3>Total Price: €${this.totalPrice}</h3>
                    <button class="order-button" @click=${(): void => this.CheckIfCartIsEmpty()}>
                        Order
                    </button>
                </div>
            </div>
        `;
    }
}
