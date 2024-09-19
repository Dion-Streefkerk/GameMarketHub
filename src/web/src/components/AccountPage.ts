import { LitElement, html, css, TemplateResult } from "lit";
import { until } from "lit-html/directives/until.js";
import { customElement, property, state } from "lit/decorators.js";
import { UserData, Address } from "@shared/types"; // Adjust import paths as necessary
import { UserService } from "../services/UserService"; // Adjust import path as necessary
import { Merchandise } from "@shared/types/Merchandise";
import { Game } from "@shared/types/Game";
import { product } from "@shared/types/product";
import { sendEmail } from "../services/emailService";

@customElement("account-page")
export class AccountPageComponent extends LitElement {
    @property({ type: Array }) public userData: UserData[] = [];
    @property({ type: Array }) public AllUserData: UserData[] = [];
    @property({ type: Array }) public AllUsers: UserData[] = [];
    @state() private newNewsletterStatus: boolean | undefined;
    @property({ type: Boolean }) public isLoggedIn: boolean = false;
    @state() private emailFilter: string = "";
    @state() private address: Address = {
        type: "",
        street: "",
        city: "",
        zip: "",
        country: "",
        address_id: 0,
    };
    @state() private userAddresses: Address[] = [];
    @state() private userAddressesFetched: boolean = false;
    @state() private _userService: UserService = new UserService();

    @state() private navigateToPage!: (item: Game | Merchandise) => void;
    @property({ type: Array }) public products: (product | Game | Merchandise)[] = [];
    @state() private editingProductId: number | null = null;
    public reviews: any[] = []; // Define the reviews property

    public static styles = css`
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 14px;
            text-align: left;
        }

        table thead tr {
            background-color: #009879;
            color: #ffffff;
            text-align: left;
            font-weight: bold;
        }

        table th,
        table td {
            padding: 8px 10px;
        }

        table tbody tr {
            border-bottom: 1px solid #dddddd;
        }

        table tbody tr:nth-of-type(even) {
            background-color: #f3f3f3;
        }

        table tbody tr:last-of-type {
            border-bottom: 2px solid #009879;
        }

        table tbody tr.active-row {
            font-weight: bold;
            color: #009879;
        }

        .truncate {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 150px;
        }

        .profile-form,
        .address-form,
        .add-product-form {
            margin: 20px 0;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f9f9f9;
        }

        .profile-form h2,
        .address-form h2,
        .add-product-form h2 {
            margin-top: 0;
        }

        .profile-form div,
        .address-form div,
        .add-product-form div {
            margin-bottom: 15px;
        }

        .profile-form label,
        .address-form label,
        .add-product-form label {
            display: block;
            margin-bottom: 5px;
        }

        .profile-form input,
        .address-form input,
        .add-product-form input,
        .profile-form textarea,
        .address-form textarea,
        .add-product-form textarea,
        .profile-form select,
        .address-form select,
        .add-product-form select {
            width: calc(100% - 20px);
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 14px;
        }

        .profile-form button,
        .address-form button,
        .add-product-form button {
            padding: 8px 16px;
            border: none;
            border-radius: 5px;
            background-color: #009879;
            color: white;
            font-size: 14px;
            cursor: pointer;
        }

        .profile-form button:hover,
        .address-form button:hover,
        .add-product-form button:hover {
            background-color: #007f63;
        }
        .product-image {
            max-width: 70px; /* Adjust as needed */
            max-height: 70px; /* Adjust as needed */
        }

        .reviews-container {
            display: flex;
            flex-direction: column;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px;
            background-color: #f9f9f9;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .review-item {
            display: flex;
            flex-direction: column;
            padding: 15px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }

        .review-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .review-item strong {
            font-size: 16px;
            color: #333;
        }

        .review-item p {
            margin: 10px 0;
            color: #666;
            font-size: 14px;
            line-height: 1.5;
        }

        .review-item hr {
            border: none;
            border-top: 1px solid #eee;
            margin: 10px 0;
        }

        .user-reviews-list {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        #newsletter-container {
            display: flex;
            align-items: start;
            justify-content: start; /* Center the content horizontally */
            margin-bottom: 15px;
        }

        #newsletter-container label {
            margin-right: 10px;
            font-weight: bold;
            text-align: start;
        }

        #newsletter-container input[type="checkbox"] {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
    `;
    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        this.userData = (await this._userService.getAllUserInfo()) || [];
        if (this.isLoggedIn && this.userData.length > 0 && this.userData[0].authorization_level_id === 1) {
            await this.fetchUserAddresses();
            await this.fetchUserReviews(); // Fetch reviews here
        }
    }

    public render(): TemplateResult {
        if (!this.userData || this.userData.length === 0) {
            return html`<h2>Error: No user data available.</h2>`;
        }
        if (this.userData[0].authorization_level_id === 1) {
            return this.renderCustomerAccount();
        } else if (this.userData[0].authorization_level_id === 2) {
            return this.renderWorkerAccount();
        } else if (this.userData[0].authorization_level_id === 3) {
            return this.renderAdminAccount();
        } else {
            return html`<h2>Unauthorized access</h2>
                <p>Your account does not have the necessary authorization level to view this page.</p>`;
        }
    }
    private async fetchUserAddresses(): Promise<void> {
        try {
            const addresses: Address[] | undefined = await this._userService.getAddresses();
            if (addresses) {
                this.userAddresses = addresses;
            }
        } catch (error) {
            console.error("Error fetching user addresses:", error);
        } finally {
            this.userAddressesFetched = true;
        }
    }

    private async deleteAddress(address: Address): Promise<void> {
        if (confirm("Are you sure you want to delete this address?")) {
            try {
                const result: boolean = await this._userService.deleteAddress(address.address_id);
                if (result) {
                    alert("Address deleted successfully!");
                    await this.fetchUserAddresses();
                } else {
                    alert("Failed to delete address. Please try again.");
                }
            } catch (error) {
                console.error("Error deleting address:", error);
                alert("An error occurred while deleting the address. Please try again.");
            }
        }
    }
    private async changeUserData(): Promise<void> {
        // Validate user data
        if (!this.userData[0].email || !this.userData[0].firstName || !this.userData[0].lastName) {
            alert("Please fill in all profile fields.");
            return;
        }

        const emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(this.userData[0].email)) {
            alert("Invalid email address");
            return;
        }
        if (!this.userData || this.userData.length === 0) {
            alert("User data not available.");
            return;
        }

        if (!this.userData[0].email || !this.userData[0].firstName || !this.userData[0].lastName) {
            alert("Please fill in all profile fields.");
            return;
        }

        const { email, firstName, lastName, newsletter_status: oldNewsletterStatus } = this.userData[0];
        const oldStatusAsBoolean: boolean = Boolean(oldNewsletterStatus); // Convert old status to boolean
        console.log("Old newsletter status:", oldStatusAsBoolean); // Added console.log for old status
        try {
            const updatedUserData: UserData | undefined = await this._userService.changeUserData({
                email,
                firstName,
                lastName,
                newsletter_status:
                    this.newNewsletterStatus !== undefined ? this.newNewsletterStatus : oldNewsletterStatus,
            });
            console.log("New newsletter status:", this.newNewsletterStatus); // Added console.log for new status
            if (updatedUserData) {
                alert("Profile updated successfully!");
                // If newsletter_status has changed, send an email
                if (
                    oldStatusAsBoolean !== this.newNewsletterStatus &&
                    this.newNewsletterStatus !== undefined
                ) {
                    await this.sendEmailBasedOnStatus(this.newNewsletterStatus ?? false);
                }
            }
        } catch (error) {
            console.error("Error updating user data:", error);
            alert("An error occurred while updating your profile. Please try again.");
        }
    }

    private async deleteUser(user: UserData): Promise<void> {
        if (confirm("Are you sure you want to delete this user?")) {
            try {
                const result: boolean | undefined = await this._userService.deleteUser(user.user_id);
                if (result) {
                    this.userData = this.userData.filter((u) => u.user_id !== user.user_id);
                    alert("User deleted successfully!");
                } else {
                    alert("Failed to delete user. Please try again.");
                }
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("An error occurred while deleting the user. Please try again.");
            }
        }
    }

    private async updateRole(user: UserData, newRoleId: number): Promise<void> {
        if (confirm("Are you sure you want to update this user's role?")) {
            try {
                const result: boolean = await this._userService.updateRole(user.user_id, newRoleId);
                if (result) {
                    const userIndex: number = this.userData.findIndex((u) => u.user_id === user.user_id);
                    if (userIndex !== -1) {
                        this.userData[userIndex].authorization_level_id = newRoleId;
                    }
                    alert("User role updated successfully!");
                } else {
                    alert("Failed to update user role. Please try again.");
                }
            } catch (error) {
                console.error("Error updating user role:", error);
                alert("An error occurred while updating the user role. Please try again.");
            }
        }
    }
    private updateEmailFilter(value: string): void {
        this.emailFilter = value;
    }
    private handleSubmit(event: Event): void {
        event.preventDefault();
    }
    private renderCustomerAccount(): TemplateResult {
        console.log(this.userData[0].newsletter_status);
        return html`
            <h2>Welcome, ${this.userData[0].firstName}!</h2>
            <p>This is your customer account page.</p>
            <p>Email: ${this.userData[0].email}</p>
            <p>First name: ${this.userData[0].firstName}</p>
            <p>Last name: ${this.userData[0].lastName}</p>
            <p>
                Newsletter Subscription: ${this.userData[0].newsletter_status ? "Subscribed" : "Unsubscribed"}
            </p>
            ${this.renderProfileForm()} ${this.renderAddressForm()} ${this.renderUserAddresses()}
            ${this.renderUserReviews()}
        `;
    }

    private async fetchUserReviews(): Promise<void> {
        try {
            const reviews: any[] = await this._userService.fetchUserReviews();
            if (reviews) {
                this.reviews = reviews;
                this.requestUpdate(); // Ensure component re-renders after updating reviews
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        }
    }

    private renderUserReviews(): TemplateResult {
        try {
            if (this.reviews.length === 0) {
                console.log("User hasn't written any reviews yet.");
                return html`<p>You haven't written any reviews yet.</p>`;
            }

            return html`
                <h2>Your Reviews</h2>
                <div class="user-reviews-list">
                    ${this.reviews.map(
                        (review) => html`
                            <div class="review-item">
                                <p><strong>Product Name:</strong> ${review.name}</p>
                                <p><strong>Review Text:</strong> ${review.review_text}</p>
                                <p><strong>Review Date:</strong> ${review.review_date}</p>
                                <hr />
                            </div>
                        `
                    )}
                </div>
            `;
        } catch (error) {
            console.error("Error rendering user reviews:", error);
            return html`<p>Failed to render user reviews.</p>`;
        }
    }

    private renderWorkerAccount(): TemplateResult {
        return html`
            <h2>Welcome, ${this.userData[0].firstName}!</h2>
            <p>This is your worker account page.</p>
            <p>Email: ${this.userData[0].email}</p>
            <p>First name: ${this.userData[0].firstName}</p>
            <p>Last name: ${this.userData[0].lastName}</p>
            ${this.renderProfileForm()} ${this.renderAddProductForm()}
            ${until(this.renderProductTable(), html`<p>Loading products...</p>`)}
        `;
    }
    private renderAdminAccount(): TemplateResult {
        return html`
            <h2>Welcome, ${this.userData[0].firstName}!</h2>
            <p>This is your Admin account page.</p>
            <p>Email: ${this.userData[0].email}</p>
            <p>First name: ${this.userData[0].firstName}</p>
            <p>Last name: ${this.userData[0].lastName}</p>
            ${this.renderProfileForm()} ${this.renderAllUsers()} ${this.renderAddProductForm()}
            ${until(this.renderProductTable(), html`<p>Loading products...</p>`)}
        `;
    }
    private renderProfileForm(): TemplateResult {
        return html`
            <div class="profile-form">
                <h2>Edit Profile Information</h2>
                <div>
                    <label for="edit-email">Email</label>
                    <input
                        type="email"
                        id="edit-email"
                        .value=${this.userData[0].email}
                        @input=${(e: InputEvent): void => {
                            this.userData[0].email = (e.target as HTMLInputElement).value;
                        }}
                    />
                </div>
                <div>
                    <label for="edit-firstName">First Name</label>
                    <input
                        type="text"
                        id="edit-firstName"
                        .value=${this.userData[0].firstName}
                        @input=${(e: InputEvent): void => {
                            this.userData[0].firstName = (e.target as HTMLInputElement).value;
                        }}
                    />
                </div>
                <div>
                    <label for="edit-lastName">Last Name</label>
                    <input
                        type="text"
                        id="edit-lastName"
                        .value=${this.userData[0].lastName}
                        @input=${(e: InputEvent): void => {
                            this.userData[0].lastName = (e.target as HTMLInputElement).value;
                        }}
                    />
                </div>
                <div id="newsletter-container">
                    <label>Newsletter Subscription</label>
                    <input
                        id="newsletter"
                        type="checkbox"
                        ?checked=${!!this.userData[0]?.newsletter_status}
                        @change=${this.handleNewsletterChange}
                    />
                </div>

                <div>
                    <button @click=${this.changeUserData} type="submit">Save Changes</button>
                </div>
            </div>
        `;
    }

    public async sendEmailBasedOnStatus(status: boolean): Promise<void> {
        // Fetch the current user's info
        const result: UserData[] | undefined = await this._userService.getAllUserInfo();
        if (!result || result.length === 0 || !result[0].email) {
            console.error("Failed to get user info or email");
            return;
        }
        let emailPayload: any;
        console.log(status);
        if (status === true) {
            emailPayload = {
                from: { name: "Luca Stars", address: "no-reply@lucastarsstore.com" },
                to: [{ address: result[0].email }],
                subject: "Thank you for joining our newsletter!",
                text: `Dear ${result[0].firstName},\n\nThank you for subscribing to the newsletter!\n\nKind regards,\nLuca Stars`,
            };
        } else {
            emailPayload = {
                from: { name: "Luca Stars", address: "no-reply@lucastarsstore.com" },
                to: [{ address: result[0].email }],
                subject: "We're sad to see you leave...",
                text: `Dear ${result[0].firstName},\n\nWe're sorry to see you unsubscribe from our newsletter. If you change your mind, we'll be here!\n\nKind regards,\nLuca Stars`,
            };
        }

        console.log("Sending email with payload:", emailPayload);

        try {
            const emailResult: any = await sendEmail(emailPayload);
            console.log("Email sent successfully:", emailResult);
        } catch (emailError) {
            console.error("Failed to send email:", emailError);
        }
    }
    private handleNewsletterChange(e: Event): void {
        const target: HTMLInputElement = e.target as HTMLInputElement;
        this.newNewsletterStatus = target.checked;
        // Inside handleNewsletterChange method
    }

    private renderAddressForm(): TemplateResult {
        return html`
            <div class="address-form">
                <h2>Add Address</h2>
                <div>
                    <label for="type">Type</label>
                    <input
                        type="text"
                        id="type"
                        .value=${this.address.type}
                        @input=${(e: InputEvent): void => {
                            this.address = { ...this.address, type: (e.target as HTMLInputElement).value };
                        }}
                    />
                </div>
                <div>
                    <label for="street">Street</label>
                    <input
                        type="text"
                        id="street"
                        .value=${this.address.street}
                        @input=${(e: InputEvent): void => {
                            this.address = { ...this.address, street: (e.target as HTMLInputElement).value };
                        }}
                    />
                </div>
                <div>
                    <label for="city">City</label>
                    <input
                        type="text"
                        id="city"
                        .value=${this.address.city}
                        @input=${(e: InputEvent): void => {
                            this.address = { ...this.address, city: (e.target as HTMLInputElement).value };
                        }}
                    />
                </div>
                <div>
                    <label for="zip">Zip Code</label>
                    <input
                        type="text"
                        id="zip"
                        .value=${this.address.zip}
                        @input=${(e: InputEvent): void => {
                            this.address = { ...this.address, zip: (e.target as HTMLInputElement).value };
                        }}
                    />
                </div>
                <div>
                    <label for="country">Country</label>
                    <input
                        type="text"
                        id="country"
                        .value=${this.address.country}
                        @input=${(e: InputEvent): void => {
                            this.address = { ...this.address, country: (e.target as HTMLInputElement).value };
                        }}
                    />
                </div>
                <div>
                    <button @click=${this.submitAddress} type="submit">Add Address</button>
                </div>
            </div>
        `;
    }

    private async submitAddress(): Promise<void> {
        //validate address
        if (
            !this.address.type ||
            !this.address.street ||
            !this.address.city ||
            !this.address.zip ||
            !this.address.country
        ) {
            alert("Please fill in all address fields.");
            return;
        }
        try {
            const result: boolean = await this._userService.addAddress(this.address);
            if (result) {
                alert("Address added successfully!");
                await this.fetchUserAddresses();
            } else {
                alert("Failed to add address. Please try again.");
            }
        } catch (error) {
            console.error("Error adding address:", error);
            alert("An error occurred while adding the address. Please try again.");
        }
    }
    private renderUserAddresses(): TemplateResult {
        if (!this.userAddressesFetched) {
            return html`<p>Loading...</p>`;
        }
        if (this.userAddresses.length === 0) {
            return html`<p>No addresses found.</p>`;
        }
        const tableRows: Array<TemplateResult> = this.userAddresses.map(
            (address: Address) => html`
                <tr>
                    <td>${address.type}</td>
                    <td>${address.street}</td>
                    <td>${address.city}</td>
                    <td>${address.zip}</td>
                    <td>${address.country}</td>
                    <td>
                        <button @click=${(): any => this.deleteAddress(address)}>Delete</button>
                    </td>
                </tr>
            `
        );
        return html`
            <h2>Your Addresses</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Street</th>
                        <th>City</th>
                        <th>Zip Code</th>
                        <th>Country</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        `;
    }
    private renderAllUsers(): TemplateResult {
        console.log("renderAllUsers");
        const roleMap: any = {
            1: "Customer",
            2: "Worker",
            3: "Admin",
        };
        const filteredUsers: UserData[] = this.AllUsers.filter((user) =>
            user.email.includes(this.emailFilter)
        );
        const tableRows: Array<TemplateResult> = filteredUsers.map(
            (user) => html`
                <tr>
                    <td>${user.user_id}</td>
                    <td>${user.email}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.newsletter_status ? "Subscribed" : "Unsubscribed"}</td>
                    <td>${roleMap[user.authorization_level_id]}</td>
                    <td>
                        <button @click=${(): any => this.deleteUser(user)}>Delete</button>
                    </td>
                    <td>
                        <select
                            @change=${(e: Event): any =>
                                this.updateRole(user, parseInt((e.target as HTMLSelectElement).value))}
                        >
                            <option value="1" ?selected=${user.authorization_level_id === 1}>Customer</option>
                            <option value="2" ?selected=${user.authorization_level_id === 2}>Worker</option>
                            <option value="3" ?selected=${user.authorization_level_id === 3}>Admin</option>
                        </select>
                    </td>
                </tr>
            `
        );
        return html`
            <h2>All Users</h2>
            <form @submit=${this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Filter by email"
                    @input=${(e: Event): void => this.updateEmailFilter((e.target as HTMLInputElement).value)}
                />
            </form>
            <table border="1">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Newsletter Subscription</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        `;
    }
    private renderAddProductForm(): TemplateResult {
        return html`
            <div class="add-product-form">
                <h2>Add Product</h2>
                <div>
                    <label for="product-type">Product Type</label>
                    <select id="product-type" @change=${this.handleProductTypeChange}>
                        <option value="Choose the Type"></option>
                        <option value="game">Game</option>
                        <option value="merchandise">Merchandise</option>
                    </select>
                </div>
                <div>
                    <label for="game_id">Game ID, ONLY TO CONNECT MERCH TO AN GAME_ID</label>
                    <input type="number" id="game_id" />
                    <div>
                        <label for="product-name">Name</label>
                        <input type="text" id="product-name" />
                    </div>
                    <div>
                        <label for="product-price">Price</label>
                        <input type="number" id="product-price" />
                    </div>
                    <div>
                        <label for="product-quantity">Inventory Quantity</label>
                        <input type="number" id="product-quantity" />
                    </div>
                    <div>
                        <label for="product-rating">Average Rating</label>
                        <input type="number" id="product-rating" step="0.1" />
                    </div>
                    <div>
                        <label for="product-category">Category</label>
                        <select id="product-category">
                            <option value="Game">Game</option>
                            <option value="Merchandise">Merchandise</option>
                        </select>
                    </div>
                    <div>
                        <label for="product-description">Description</label>
                        <textarea id="product-description"></textarea>
                    </div>
                    <div>
                        <label for="product-images">Image URLs (comma-separated)</label>
                        <input type="text" id="product-images" />
                    </div>
                    <div id="specific-fields"></div>
                    <button @click=${this.submitProduct}>Add Product</button>
                </div>
            </div>
        `;
    }
    private handleProductTypeChange(event: Event): void {
        const productType: string = (event.target as HTMLSelectElement).value;
        const specificFieldsContainer: HTMLElement | null | undefined =
            this.shadowRoot?.getElementById("specific-fields");
        if (specificFieldsContainer) {
            specificFieldsContainer.innerHTML = "";
            if (productType === "game") {
                specificFieldsContainer.innerHTML = `
          <div>
            <label for="game-platform">Platform</label>
            <input type="text" id="game-platform" />
          </div>
          <div>
            <label for="game-release-date">Release Date</label>
            <input type="date" id="game-release-date" />
          </div>
        `;
            } else if (productType === "merchandise") {
                specificFieldsContainer.innerHTML = `
          <div>
            <label for="merch-size">Size</label>
            <input type="text" id="merch-size" />
          </div>
          <div>
            <label for="merch-color">Color</label>
            <input type="text" id="merch-color" />
          </div>
        `;
            }
        }
    }
    private async submitProduct(): Promise<void> {
        const productType: string = (this.shadowRoot?.getElementById("product-type") as HTMLSelectElement)
            .value;
        const game_id: number = parseInt(
            (this.shadowRoot?.getElementById("game_id") as HTMLInputElement).value
        );
        const name: string = (this.shadowRoot?.getElementById("product-name") as HTMLInputElement).value;
        const price: number = parseFloat(
            (this.shadowRoot?.getElementById("product-price") as HTMLInputElement).value
        );
        const inventoryQuantity: number = parseInt(
            (this.shadowRoot?.getElementById("product-quantity") as HTMLInputElement).value,
            10
        );
        const averageRating: number = parseFloat(
            (this.shadowRoot?.getElementById("product-rating") as HTMLInputElement).value
        );
        const category: string = (this.shadowRoot?.getElementById("product-category") as HTMLInputElement)
            .value;
        const description: string = (
            this.shadowRoot?.getElementById("product-description") as HTMLTextAreaElement
        ).value;
        const imageUrls: string[] = (
            this.shadowRoot?.getElementById("product-images") as HTMLInputElement
        ).value.split(",");

        // Validate average rating
        if (averageRating < 0 || averageRating > 5) {
            alert("Average rating must be between 0 and 5.");
            return;
        }

        //validate empty fields
        if (!name || !price || !inventoryQuantity || !category || !description || !imageUrls) {
            alert("Please fill in all product fields.");
            return;
        }
        

        const productData: any = {
            productType,
            game_id,
            name,
            price,
            inventory_quantity: inventoryQuantity,
            average_rating: averageRating,
            category,
            description,
            image: imageUrls,
        };

        if (productType === "game") {
            productData.platform = (
                this.shadowRoot?.getElementById("game-platform") as HTMLInputElement
            ).value;
            productData.release_date = (
                this.shadowRoot?.getElementById("game-release-date") as HTMLInputElement
            ).value;
        } else if (productType === "merchandise") {
            productData.size = (this.shadowRoot?.getElementById("merch-size") as HTMLInputElement).value;
            productData.color = (this.shadowRoot?.getElementById("merch-color") as HTMLInputElement).value;
        }

        try {
            const result: any = await this._userService.addProduct(productData);
            if (result) {
                alert("Product added successfully!");
            } else {
                alert("Failed to add product. Please try again.");
            }
        } catch (error) {
            console.error("Error adding product:", error);
            alert("An error occurred while adding the product. Please try again.");
        }
    }
    private async renderProductTable(): Promise<TemplateResult> {
        let products: (product | Game | Merchandise)[] | undefined;

        try {
            products = await this._userService.getAllProducts();
        } catch (error) {
            console.error("Error fetching products:", error);
            return html`<p>Error loading products. Please try again later.</p>`;
        }

        if (!products || products.length === 0) {
            return html`<p>No products found.</p>`;
        }

        type Rating = 1 | 2 | 3 | 4 | 5;

        const renderStars: any = (rating: Rating): TemplateResult => {
            const filledStars: any = rating;
            const emptyStars: any = 5 - filledStars;

            const stars: string[] = [];
            for (let i: any = 0; i < filledStars; i++) {
                stars.push("★");
            }
            for (let i: any = 0; i < emptyStars; i++) {
                stars.push("☆");
            }

            return html`${stars.join("")}`;
        };

        const renderTableRows: any = (items: (Game & Merchandise)[], columns: string[]): TemplateResult[] => {
            return items.flatMap((item) => {
                const isEditing: any = this.editingProductId === item.product_id;
                return [
                    html`
                        <tr>
                            ${columns.map((column) => {
                                if (column === "average_rating") {
                                    return html`<td>${renderStars((item as any)[column])}</td>`;
                                } else if (column === "image") {
                                    return html`<td>
                                        <img
                                            class="product-image"
                                            src="${item.image_urls}"
                                            alt="${item.name}"
                                        />
                                    </td>`;
                                } else if (column === "color") {
                                    const color: any = (item as any)[column];
                                    return html`<td>
                                        <div
                                            style="width: 20px; height: 50px; background-color: ${color};"
                                        ></div>
                                    </td>`;
                                } else if (column === "price") {
                                    return html`<td>€ ${(item as any)[column]}</td>`;
                                } else {
                                    return html`<td>${(item as any)[column]}</td>`;
                                }
                            })}
                            <td class="button-container">
                                <button class="button" @click="${(): void => this.navigateToPage(item)}">
                                    View details
                                </button>
                                <button
                                    class="button button-blue"
                                    @click="${(): void => this.toggleEdit(item.product_id)}"
                                >
                                    Edit
                                </button>
                                <button
                                    class="button button-red"
                                    @click="${(): any => this.deleteProduct(item.product_id)}"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                        ${isEditing ? this.renderProductEditRow(item) : html``}
                    `,
                ];
            });
        };

        const gameColumns: string[] = [
            "name",
            "product_id",
            "price",
            "inventory_quantity",
            "average_rating",
            "description",
            "image",
            "platform",
            "release_date",
            "game_id",
        ];
        const merchColumns: string[] = [
            "name",
            "product_id",
            "price",
            "inventory_quantity",
            "average_rating",
            "description",
            "image",
            "size",
            "color",
        ];

        return html`
            <h2>Games</h2>
            <table border="1" cellspacing="0" cellpadding="5">
                <thead>
                    <tr>
                        ${gameColumns.map((column) => html`<th>${column.replace(/_/g, " ")}</th>`)}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${renderTableRows(
                        products.filter((product): product is Game => product.category === "Game"),
                        gameColumns
                    )}
                </tbody>
            </table>

            <h2>Merchandise</h2>
            <table border="1" cellspacing="0" cellpadding="5">
                <thead>
                    <tr>
                        ${merchColumns.map((column) => html`<th>${column.replace(/_/g, " ")}</th>`)}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${renderTableRows(
                        products.filter(
                            (product): product is Merchandise => product.category === "Merchandise"
                        ),
                        merchColumns
                    )}
                </tbody>
            </table>
        `;
    }
    private toggleEdit(productId: number): void {
        this.editingProductId = this.editingProductId === productId ? null : productId;
    }
    private renderProductCommonFields(item: Game | Merchandise): TemplateResult {
        const commonFields: any = html`
            <td>
                <input
                    type="text"
                    value="${item.name}"
                    @input="${(e: any): any => this.updateEditField("name", e.target.value, item)}"
                />
            </td>
            <td>${item.product_id}</td>
            <td>
                <input
                    type="text"
                    value="${item.price}"
                    @input="${(e: any): any => this.updateEditField("price", e.target.value, item)}"
                />
            </td>
            <td>
                <input
                    type="text"
                    value="${item.inventory_quantity}"
                    @input="${(e: any): any =>
                        this.updateEditField("inventory_quantity", e.target.value, item)}"
                />
            </td>
            <td>${item.average_rating}</td>
            <td>
                <input
                    type="text"
                    value="${item.description}"
                    @input="${(e: any): any => this.updateEditField("description", e.target.value, item)}"
                />
            </td>
            <td>
                <input
                    type="text"
                    value="${item.image_urls}"
                    @input="${(e: any): any => this.updateEditField("image_urls", e.target.value, item)}"
                />
            </td>
        `;
        return commonFields;
    }
    public isMerchandise(item: any): item is Merchandise {
        return item && item.category === "Merchandise";
    }
    private renderProductEditRow(item: Game | Merchandise): TemplateResult {
        const isEditing: boolean = this.editingProductId === item.product_id;
        if (!isEditing) {
            return html``;
        }

        const commonFields: TemplateResult = this.renderProductCommonFields(item);

        let specificFields: TemplateResult;

        // Use type guard to check for category
        if (this.hasCategory(item)) {
            if (item.category.toLowerCase() === "merchandise") {
                specificFields = this.renderMerchandiseSpecificFields(item as Merchandise);
                console.log("Merchandise specific fields filled:", item);
            } else if (item.category.toLowerCase() === "game") {
                const game: Game = item as Game;
                specificFields = this.renderGameSpecificFields(game);
            } else {
                console.error("Unknown product category:", item);
                return html``;
            }
        } else {
            console.error("Item does not have a valid category:", item);
            return html``;
        }

        return html`
            <tr class="edit-dropdown">
                ${commonFields} ${specificFields}
                <td>
                    <button
                        @click="${(): any => {
                            console.log("Saving product:", item);
                            void this.saveProduct(item);
                        }}"
                    >
                        Save
                    </button>
                </td>
            </tr>
        `;
    }
    private renderGameSpecificFields(item: Game): TemplateResult {
        return html`
            <td>
                <input
                    type="text"
                    value="${item.platform}"
                    @input="${(e: any): any => this.updateEditField("platform", e.target.value, item)}"
                />
            </td>
            <td>
                <input
                    type="text"
                    value="${item.release_date}"
                    @input="${(e: any): any => this.updateEditField("release_date", e.target.value, item)}"
                />
            </td>
        `;
    }
    private renderMerchandiseSpecificFields(item: Merchandise): TemplateResult {
        return html`
            <td>
                <input
                    type="text"
                    value="${item.size}"
                    @input="${(e: any): any => this.updateEditField("size", e.target.value, item)}"
                />
            </td>
            <td>
                <input
                    type="text"
                    value="${item.color}"
                    @input="${(e: any): any => this.updateEditField("color", e.target.value, item)}"
                />
            </td>
        `;
    }
    private updateEditField(
        field: keyof Game | keyof Merchandise,
        value: any,
        item: Game | Merchandise
    ): void {
        // Update the item object with the new value for the field being edited
        (item as any)[field] = value;
    }
    public hasCategory(item: any): item is { category: string } {
        return item && typeof item.category === "string";
    }
    private async saveProduct(item: Game | Merchandise): Promise<void> {

        // Check if item has a category property
        if (!this.hasCategory(item)) {
            console.error("Item does not have a valid category:", item);
            return;
        }

        // Determine the product type based on the category field
        const productType: string =
            item.category.toLowerCase() === "game"
                ? "game"
                : item.category.toLowerCase() === "merchandise"
                ? "merchandise"
                : "unknown";

        console.log("Determined productType:", productType);

        if (productType === "unknown") {
            console.error("Unknown product type:", item);
            return;
        }

        let requestBody: any;

        // Create the request body based on the product type
        if (productType === "merchandise") {
            const merchandise: Merchandise = item as Merchandise;

            // Create the request body with merchandise-specific fields
            requestBody = {
                productId: merchandise.product_id,
                productType: "merchandise",
                ...merchandise,
            };
        } else if (productType === "game") {
            const game: Game = item as Game;
            if (game.release_date) {
                game.release_date = new Date(game.release_date).toISOString().split("T")[0];
            }

            // Create the request body with game-specific fields
            requestBody = {
                productId: game.product_id,
                productType: "game",
                ...game,
            };
        }

        try {
            const response: boolean = await this._userService.editProduct(item.product_id, requestBody);
            if (response) {
                console.log("Product saved successfully.");
                this.editingProductId = null;
                await this.renderProductTable();
            } else {
                console.error("Failed to save product.");
            }
        } catch (error) {
            console.error("Error saving product:", error);
        }
    }
    /**
     * Deletes a product by its ID and refreshes the product table.
     * @param productId - The ID of the product to be deleted.
     */
    private async deleteProduct(productId: number): Promise<void> {
        if (confirm(`Are you sure you want to delete the product with ID ${productId} `)) {
            try {
                const success: boolean = await this._userService.deleteProduct(productId);
                if (success) {
                    alert("product deleted successfully!");
                } else {
                    console.error("Failed to delete product");
                }
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    }
}
