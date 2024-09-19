import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CartItem, UserData } from "@shared/types";
import { sendEmail } from "../services/emailService";

@customElement("order-complete")
export class OrderComplete extends LitElement {
    @property({ type: Array }) public userdata!: UserData[];
    @property({ type: Number }) public totalPrice: number = 0;
    @property({ type: Array }) public cartItems: CartItem[] = [];
    @property({ type: Object }) public selectedAddress!: { street: string; city: string; zip: string; country: string };

    public static styles = css`
        .order-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            box-sizing: border-box;
        }

        .order-items {
            width: 100%;
            margin-top: 20px;
        }

        .order-item {
            display: flex;
            flex-direction: row;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 10px;
            background-color: #fff;
            transition: box-shadow 0.3s ease;
            box-sizing: border-box;
        }

        .order-item:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .order-item-image {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 8px;
            margin-right: 20px;
        }

        .order-item-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }

        .order-item-info {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }

        .order-item-name {
            font-size: 18px;
            font-weight: bold;
            margin: 5px 0;
        }

        .order-item-description {
            font-size: 14px;
            color: #555;
            margin: 5px 0;
        }

        .order-item-price {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin: 5px 0;
        }

        .order-total {
            width: 100%;
            max-width: 800px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 2px solid #ccc;
            padding-top: 20px;
            margin-top: 20px;
        }

        .order-message {
            font-size: 20px;
            font-weight: bold;
            color: #4caf50;
            margin-bottom: 20px;
        }

        .order-address {
            width: 100%;
            max-width: 800px;
            margin: 20px 0;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: #fff;
            box-sizing: border-box;
        }

        @media (max-width: 768px) {
            .order-item {
                flex-direction: column;
            }

            .order-item-image {
                width: 100%;
                max-width: 100%;
                height: auto;
                margin-bottom: 10px;
            }

            .order-item-details {
                flex-direction: column;
                align-items: flex-start;
            }
        }
    `;

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.sendOrderConfirmationEmail();
    }

    public async sendOrderConfirmationEmail(): Promise<void> {
        if (!this.userdata || this.userdata.length === 0) {
            console.error("No user data available");
            return;
        }

        const user: UserData = this.userdata[0]; 
        const emailPayload: any = {
            from: { name: "luca stars", address: "no-reply@lucastarsstore.com" },
            to: [{ address: user.email }],
            subject: "Your order has been placed successfully!",
            text: `Dear ${user.firstName},\n\nThank you for your purchase! Your order has been placed and paid successfully. Here are the details of your order:\n\nShipping Address:\n${this.selectedAddress.street}\n${this.selectedAddress.city}, ${this.selectedAddress.zip}\n${this.selectedAddress.country}\n\nOrder Items:\n${this.cartItems.map(item => `${item.name} (Quantity: ${item.quantity}) - €${item.price}`).join("\n")}\n\nTotal Price: €${this.totalPrice}\n\nBest regards,\nLuca Stars Webshop`,
        };

        try {
            const emailResult: any = await sendEmail(emailPayload);
            if(emailResult){
                console.log("Email sent successfully");
            }
        } catch (emailError) {
            console.error("Failed to send email:", emailError);
        }
    }

    public render(): TemplateResult {
        if (!this.userdata || this.userdata.length === 0) {
            return html`<p>No user data available</p>`;
        }

        const user: UserData = this.userdata[0]; 

        return html`
            <h1>Order Complete</h1>
            <div class="order-content">
                <p class="order-message">Thank you for your purchase, ${user.firstName}! Your order has been placed successfully.</p>
                <div class="order-address">
                    <h3>Shipping Address:</h3>
                    <p>${this.selectedAddress.street}</p>
                    <p>${this.selectedAddress.city}, ${this.selectedAddress.zip}</p>
                    <p>${this.selectedAddress.country}</p>
                </div>
                <div class="order-items">
                    ${this.cartItems.map(
                        (item) => html`
                            <div class="order-item">
                                <img src="${item.image_urls}" alt="${item.name}" class="order-item-image" />
                                <div class="order-item-details">
                                    <div class="order-item-info">
                                        <p class="order-item-name">${item.name}</p>
                                        <p class="order-item-description">${item.description}</p>
                                    </div>
                                    <div>
                                        <p class="order-item-price">€${item.price}</p>
                                        <p>Quantity: ${item.quantity}</p>
                                    </div>
                                </div>
                            </div>
                        `
                    )}
                </div>
                <div class="order-total">
                    <h3>Total Price: €${this.totalPrice}</h3>
                </div>
            </div>
        `;
    }
}
