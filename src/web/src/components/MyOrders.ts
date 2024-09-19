import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { UserService } from "../services/UserService";
import { OrderItemWithProduct, Order } from "@shared/types/Order";

/**
 * @element my-orders
 * @extends LitElement
 *
 * This component represents a user's order history.
 */
@customElement("my-orders")
export class MyOrders extends LitElement {
    private userService: UserService = new UserService();

    @property({ type: Array }) public orderItems: OrderItemWithProduct[] = [];

    @state() private orders: Order[] = [];
    @state() private loading: boolean = true;
    /**
     * Styles for the games page component.
     * @internal
     */
    public static styles = css`
    .orders-container {
        display: flex;
        flex-direction: column;
        max-width: 900px;
        margin: 0 auto;
        padding: 20px;
        border-radius: 15px;
        background-color: #ffffff;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .order-item {
        border-bottom: 1px solid #e0e0e0;
        padding: 20px 0;
    }

    .order-item:last-child {
        border-bottom: none;
    }

    .order-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        font-size: 1.1em;
        color: #333;
    }

    .order-id, .order-date, .order-status, .order-total {
        font-weight: bold;
    }

    .order-items {
        margin-top: 15px;
        padding-left: 0;
    }

    .order-items ul {
        list-style-type: none;
        padding: 0;
    }

    .order-items li {
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        padding: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        background-color: #f9f9f9;
    }

    .order-items img {
        margin-right: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        width: 80px;
        height: 80px;
        object-fit: cover;
    }

    .no-orders {
        text-align: center;
        margin-top: 30px;
        font-size: 1.2em;
        color: #888;
    }

    @media (max-width: 600px) {
        .order-details {
            flex-direction: column;
            align-items: flex-start;
        }

        .order-details > div {
            margin-bottom: 5px;
        }

        .order-details > div:last-child {
            margin-bottom: 0;
        }
    }
`;

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.loadOrders();
    }

    /**
     * Loads the user's order items from the server.
     * @returns A promise that resolves when the order items have been loaded.
     */
    private async loadOrders(): Promise<void> {
        this.loading = true;
        try {
            const orders: Order[] | undefined = await this.userService.getOrderItems();
            console.log(orders); // Debug log to inspect order items
            if (orders) {
                this.orders = orders;
            }
        } catch (error) {
            console.error("Failed to load order items:", error);
        } finally {
            this.loading = false;
        }
    }

    /**
     * Renders the order items in the UI.
     * @returns The template result.
     */
    private renderOrders(): TemplateResult {
        if (this.orders.length === 0) {
            return html`<div class="no-orders">Je hebt nog geen bestellingen geplaatst.</div>`;
        }

        return html`
            ${this.orders.map(order => html`
                <div class="order-item">
                    <div class="order-details">
                        <div class="order-id">Ordernummer: ${order.order_id}</div>
                        <div class="order-date">Datum: ${this.formatDate(order.order_date)}</div>
                        <div class="order-status">Status: ${order.status}</div>
                        <div class="order-total">Totaal: &euro;${order.total_price}</div>
                    </div>
                    <div class="order-items">
                        <ul>
                            ${order.items.map((item: OrderItemWithProduct) => html`
                                <li>
                                    <img src="${this.ensureValidImageUrl(item.image_urls)}" alt="${item.name}" width="50" height="50">
                                    ${item.quantity} x ${item.name} - &euro;${item.price}
                                </li>
                            `)}
                        </ul>
                    </div>
                </div>
            `)}
        `;
    }

    /**
     * 
     * @param dateString 
     * @returns formatted date string
     */
    private formatDate(dateString: string): string {
        const date: any = new Date(dateString);
        return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
    }


    /**
     * Ensures that the image URL is valid.
     * @param url The image URL to validate.
     * @returns The image URL if it is valid, or a default image URL otherwise.
     */
    private ensureValidImageUrl(url: string): string {
        return url && url.trim() !== "" ? url : "path/to/default/image.png";
    }

    /**
     * Renders the component.
     * @returns The template result if orders aren't loaded yet.
     */
    public render(): TemplateResult {
        return html`
            <div class="orders-container">
                <h2>Mijn Bestellingen</h2>
                ${this.loading ? html`<p>Bestellingen laden...</p>` : this.renderOrders()}
            </div>
        `;
    }
}
