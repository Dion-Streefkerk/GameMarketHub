import { Address, CartItem, UserData } from "@shared/types";
import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { UserService } from "../services/UserService";

@customElement("checkout-component")
export class CheckoutComponent extends LitElement {
    @property({ type: Array })
    private userdata: UserData[] = [];

    @property({ type: Number })
    private totalPrice: number = 0;

    @property({ type: Array })
    private cartItems: CartItem[] = [];

    @property({ type: Function })
    private navigateToOrderPage!: (selectedAddress: Address) => void;

    @property({ type: Number })
    private cart_id: number = 0;


    @state()
    private addresses: Address[] = [];

    @state()
    private selectedAddress: Address | null = null;

    
    private userService: UserService = new UserService();

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        try {
            const addresses: Address[] | undefined = await this.userService.getAddresses();
            if (addresses) {
                this.addresses = addresses;
                if (addresses.length > 0) {
                    this.selectedAddress = addresses[0];
                }

            }
        } catch (error) {
            console.error("Failed to fetch addresses", error);
        }
    }

    public static styles = css`
        .checkout-form {
            display: flex;
            flex-direction: column;
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px;
            background-color: #fff;
        }

        .checkout-form div {
            margin-bottom: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .checkout-form label {
            margin-bottom: 5px;
            font-weight: bold;
            text-align: center;
            width: 100%;
        }

        .checkout-form input[type="text"],
        .checkout-form input[type="email"],
        .checkout-form input[type="tel"],
        .checkout-form input[type="address"] {
            width: calc(100% - 20px);
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            text-align: center;
        }

        .checkout-form select {
            width: calc(100% - 20px);
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            text-align: center;
        }

        .checkout-form button {
            padding: 10px 20px;
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .checkout-form button:hover {
            background-color: #45a049;
        }

        .total-price {
            font-weight: bold;
            margin-top: 20px;
            text-align: center;
        }
    `;

    private handleInputChange(event: Event): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        const { name, value } = target;
        this[name as keyof this] = value as this[keyof this];
    }

    private handleAddressChange(event: Event): void {
        const selectedAddressId: string = (event.target as HTMLSelectElement).value;
        const selectedAddress: Address | undefined = this.addresses.find(
            (address: Address) => address.address_id === parseInt(selectedAddressId, 10)
        );

        if (selectedAddress) {
            this.selectedAddress = selectedAddress;
            this.updateInputFieldsWithAddress(selectedAddress);
        }
    }

    private updateInputFieldsWithAddress(address: Address): void {
        (this.shadowRoot?.getElementById("street") as HTMLInputElement).value = address.street;
        (this.shadowRoot?.getElementById("city") as HTMLInputElement).value = address.city;
        (this.shadowRoot?.getElementById("postal_code") as HTMLInputElement).value = address.zip;
        (this.shadowRoot?.getElementById("country") as HTMLInputElement).value = address.country;
    }

    public render(): TemplateResult {
        const hasAddresses: boolean = this.addresses.length > 0;

        return html`
            <div class="checkout-form">
                <h2>Checkout</h2>
                <div>
                    <label for="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="firstName"
                        .value=${this.userdata[0]?.firstName || ""}
                        @input=${this.handleInputChange}
                    />
                </div>
                <div>
                    <label for="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        .value=${this.userdata[0]?.lastName || ""}
                        @input=${this.handleInputChange}
                    />
                </div>
                <div>
                    <label for="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        .value=${this.userdata[0]?.email || ""}
                        @input=${this.handleInputChange}
                    />
                </div>

                ${hasAddresses
                    ? html`
                          <div>
                              <label for="addressSelect">Select Address</label>
                              <select
                                  id="addressSelect"
                                  name="selectedAddressId"
                                  @change=${this.handleAddressChange}
                              >
                                  ${this.addresses.map(
                                      (address: Address, index: number) => html`
                                          <option value="${address.address_id}" ?selected=${index === 0}>
                                              ${address.street}, ${address.city}, ${address.zip}
                                          </option>
                                      `
                                  )}
                              </select>
                          </div>
                      `
                    : html``}

                <div>
                    <label for="street">Street</label>
                    <input
                        type="text"
                        id="street"
                        name="street"
                        .value=${this.selectedAddress ? this.selectedAddress.street : ""}
                        @input=${this.handleInputChange}
                    />
                </div>
                <div>
                    <label for="city">City</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        .value=${this.selectedAddress ? this.selectedAddress.city : ""}
                        @input=${this.handleInputChange}
                    />
                </div>
                <div>
                    <label for="postal_code">Postal Code</label>
                    <input
                        type="text"
                        id="postal_code"
                        name="postal_code"
                        .value=${this.selectedAddress ? this.selectedAddress.zip : ""}
                        @input=${this.handleInputChange}
                    />
                </div>
                <div>
                    <label for="country">Country</label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        .value=${this.selectedAddress ? this.selectedAddress.country : ""}
                        @input=${this.handleInputChange}
                    />
                </div>

                <strong>Total: &euro; ${this.totalPrice}</strong>
                <div>
                    <button @click=${this.placeOrder}>Place Order</button>
                </div>
            </div>
        `;
    }

    private async placeOrder(): Promise<void> {
        // If no address is selected, create one from the input fields
        if (!this.selectedAddress) {
            this.selectedAddress = {
                address_id: 0, // or generate a new ID if required
                street: (this.shadowRoot?.getElementById("street") as HTMLInputElement).value,
                city: (this.shadowRoot?.getElementById("city") as HTMLInputElement).value,
                zip: (this.shadowRoot?.getElementById("postal_code") as HTMLInputElement).value,
                country: (this.shadowRoot?.getElementById("country") as HTMLInputElement).value,
            };
        }

        //check if fields are empty
        if (
            !this.userdata[0]?.firstName ||
            !this.userdata[0]?.lastName ||
            !this.userdata[0]?.email ||
            !this.selectedAddress.street ||
            !this.selectedAddress.city ||
            !this.selectedAddress.zip ||
            !this.selectedAddress.country
        ) {
            alert("Please fill in all fields");
            return;
        }

        const result: any = await this.userService.orderComplete(this.cartItems);
        if (result) {
            console.log("Order placed successfully");
        }
        const emptyCart: any = await this.userService.emptyCart(this.cart_id);
        if (emptyCart) {
            console.log("Cart emptied successfully");
        }
        // Ensure selectedAddress is not null before calling navigateToOrderPage
        if (this.selectedAddress) {
            this.navigateToOrderPage(this.selectedAddress);
        } else {
            console.error("Selected address is not defined");
        }
    }
}
