import { LitElement, TemplateResult, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UserService } from "../services/UserService";
import { OrderItem } from "@shared/types/OrderItem";
import { TokenService } from "../services/TokenService";
import { OrderItemService } from "../services/OrderItemService";
// import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { UserData } from "@shared/types/UserData";
import { product } from "@shared/types/product";
import "../components/CheckOut";
import "../components/ProductPage";
import "../components/GamesPage";
import "../components/MerchandisePage";
import "../components/AccountPage";
import "../components/ShoppingCart";
import { UserCartResponse } from "@shared/responses/UserCartResponse";
import "../components/OrderComplete";
import "../components/MyOrders";
import { Address, CartItem } from "@shared/types";
import { sendEmail } from "../services/emailService";

import "../components/WishList";
import { WishItem } from "@shared/types";

import "../components/SearchBar";

/** Enumeration to keep track of all the different pages */
enum RouterPage {
    Home = "orderItems",
    Login = "login",
    Register = "register",
    Games = "games",
    Merchandise = "merchandise",
    Cart = "cart",
    Wishlist = "wishlist",
    Searchbar = "searchbar",
    Account = "account",
    product = "product",
    checkout = "checkout",
    order = "order",
    myOrders = "myOrders",
}

/**
 * Custom element based on Lit for the header of the webshop.
 *
 * @todo Most of the logic in this component is over-simplified. You will have to replace most of if with actual implementions.
 */
@customElement("webshop-root")
export class Root extends LitElement {
    /**
     * CSS styles for the component.
     */
    public static styles = css`
        header {
            background-color: #fff;
            border-bottom: 1px solid #eaeaea;
            padding: 0 20px;
        }

        main {
            padding: 20px;
            background-color: #f9f9f9;
        }

        footer {
            background-color: #fff;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #666;
            border-top: 1px solid #eaeaea;
        }

        .newsletter-subscription {
            margin-bottom: 20px;
        }

        .email {
            padding: 10px;
            font-size: 14px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        .subscribe {
            padding: 10px 20px;
            font-size: 14px;
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #ffffff;
            padding: 10px 20px;
            border-radius: 50px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin: 20px;
        }

        .nav-left,
        .nav-right {
            display: flex;
            align-items: center;
        }

        .nav-left {
            margin-right: auto;
        }

        .nav-right {
            margin-left: auto;
        }

        .nav-right > * {
            margin: 0 10px;
        }

        nav .logo img {
            height: 50px;
            cursor: pointer;
        }

        nav .cart img {
            height: 55px;
            cursor: pointer;
        }

        .navbar-toggler {
            border: none;
            font-size: 1.25rem;
        }

        .navbar-toggler:focus,
        .btn-close:focus {
            box-shadow: none;
            outline: none;
        }

        .nav-link {
            background-color: #fff;
            color: #666;
            font-size: 14px;
            padding: 10px 20px;
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

        .login-button,
        .register-button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            transition: background-color 0.3s;
            border: none;
            cursor: pointer;
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

        .logout-button {
            background-color: red;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            border-bottom: 2px solid #a00;
            text-decoration: none;
            transition: background-color 0.3s;
            border: none;
            cursor: pointer;
        }

        .logout-button:hover {
            opacity: 0.8;
        }

        .login-button:hover,
        .register-button:hover {
            background-color: #0056b3;
        }

        .form {
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .form div {
            margin-bottom: 15px;
        }

        .form label {
            display: block;
            font-size: 14px;
            margin-bottom: 5px;
            color: #333;
        }

        .form input[type="text"],
        .form input[type="password"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #eaeaea;
            border-radius: 4px;
            box-sizing: border-box;
        }

        .form button {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 4px;
            background-color: #007bff;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .form button:hover {
            background-color: #0056b3;
        }

        .form .alt-option {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #666;
        }

        .form .alt-option button {
            background-color: #f9f9f9;
            color: #007bff;
            font-size: 14px;
            text-decoration: underline;
            border: none;
            cursor: pointer;
            padding: 0;
        }

        .order-items {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 20px 0;
        }

        .order-item {
            display: flex;
            flex-direction: column;
            border: 1px solid #eaeaea;
            border-radius: 8px;
            padding: 20px;
            background: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: box-shadow 0.3s ease, transform 0.3s ease;
        }

        .order-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .order-item img {
            width: 100%;
            height: auto;
            border-radius: 8px;
            object-fit: cover;
            margin-bottom: 10px;
        }

        .order-item h2 {
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0;
        }

        .order-item p {
            font-size: 14px;
            color: #555;
            margin: 5px 0;
        }

        .order-item-price {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin: 10px 0;
        }

        .button-group {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-top: auto;
        }

        .order-button,
        .view-details-button {
            background-color: #4caf50;
            border: none;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s ease;
            text-align: center;
            text-decoration: none;
            margin-top: 5px;
        }

        .order-button {
            background-color: #4caf50;
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

        .about-us {
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin-top: 20px;
        }

        .about-us h2 {
            font-size: 24px;
            margin-bottom: 10px;
            color: #333;
        }

        .about-us p {
            font-size: 16px;
            color: #555;
            line-height: 1.5;
            margin-bottom: 10px;
        }

        @media (max-width: 1200px) {
            .order-items {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 900px) {
            .order-items {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 600px) {
            .order-items {
                grid-template-columns: 1fr;
            }
        }

        .left-links {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-right: auto;
        }

        .navbar-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .cart-content {
            display: flex;
            justify-content: space-between;
        }

        .back-button {
            background-color: #ccc;
            border: none;
            color: black;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin: 4px 2px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .back-button:hover {
            background-color: #aaa;
        }

        .cart-total {
            display: flex;
            justify-content: center;
            align-items: center;
            border: 2px solid #000000;
            background-color: #d5d5d5;
            padding: 20px;
            margin: 50px;
            max-height: 400px;
            width: 20%;
        }

        .cart {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .cart-items-count {
            background-color: #007bff;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            margin-left: -20px;
            margin-top: 20px; /* adjust as needed */
            text-align: center;
            line-height: 20px;
            font-size: 12px;
        }

        .product-details {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }

        .product-details h2 {
            font-size: 2em;
            margin: 10px 0;
        }

        .product-details p {
            font-size: 1.2em;
            color: #555;
        }

        .product-details img {
            max-width: 100%;
            height: auto;
            margin-top: 20px;
        }
    `;

    @state()
    private _currentPage: RouterPage = RouterPage.Home;

    // private _gamePage: RouterPage = RouterPage.Games;

    @state()
    private _isLoggedIn: boolean = false;

    @state()
    private _orderItems: OrderItem[] = [];

    @state()
    public _wishlistItemsCount: number = 0;

    @state()
    public _cartItemsCount: number = 0;

    @state()
    private productDetails: product | OrderItem | null = null;

    private _userService: UserService = new UserService();
    private _orderItemService: OrderItemService = new OrderItemService();
    private _tokenService: TokenService = new TokenService();
    // private userData: UserData[] = [];
    private _email: string = "";
    private _password: string = "";
    private _voornaam: string = "";
    private _achternaam: string = "";
    @state()
    private _games: OrderItem[] = [];

    @state()
    private _merchandise: OrderItem[] = [];

    @state()
    private _gamesFeatured: OrderItem[] = [];

    @state()
    private _merchandiseFeatured: OrderItem[] = [];

    @state()
    private userData: UserData[] = [];

    @state()
    private totalPrice: number = 0;

    @state()
    private cartItems: CartItem[] = [];

    @state()
    private cart_id: number = 0;

    @state()
    private selectedAddress: Address | null = null;

    @state()
    private AllUsers: UserData[] = [];

    /**
     * Fetches order items and checks if the user is logged in.
     */
    public async connectedCallback(): Promise<void> {
        super.connectedCallback();

        const token: any | null = this._tokenService.getToken();
        if (!token) {
            this._isLoggedIn = false;
        }
        // Check if the user is logged in
        await this.checkIfLoggedIn();

        // Load the cart items
        await this.loadCartItems();

        await this.getOrderItems();

        // Filter and store the games and merchandise items
        this._games = this._orderItems.filter((item) => item.category === "Game");
        this._merchandise = this._orderItems.filter((item) => item.category === "Merchandise");

        // Shuffle the order items array
        const shuffledItems: any = this._orderItems.sort(() => Math.random() - 0.5);

        // Filter and store the random games
        this._gamesFeatured = shuffledItems.filter((item: any) => item.category === "Game").slice(0, 3);
        this._merchandiseFeatured = shuffledItems
            .filter((item: any) => item.category === "Merchandise")
            .slice(0, 3);
    }

    /**
     * Check if the current token is valid and update the cart item total
     */
    // private async getWelcome(): Promise<void> {
    //     const result: UserHelloResponse | undefined = await this._userService.getWelcome();

    //     if (result) {
    //         this._isLoggedIn = true;
    //         this._cartItemsCount = result.cartItems?.length || 0;
    //     }
    // }

    /**
     * Get all available order items
     */
    private async getOrderItems(): Promise<void> {
        const result: OrderItem[] | undefined = await this._orderItemService.getAll();

        if (!result) {
            return;
        }

        this._orderItems = result;
    }

    /**
     * Get all available user info
     * @returns Promise<void>
     */

    private async getUserInfo(): Promise<void> {
        const result: UserData[] | undefined = await this._userService.getAllUserInfo();

        if (!result) {
            return;
        }

        this.userData = result;
    }

    /**
     * Get all available users
     * @returns Promise<void>
     */
    private async getAllUsers(): Promise<void> {
        const Allusersresult: UserData[] | undefined = await this._userService.getAllUsers();

        if (!Allusersresult) {
            return;
        }

        this.AllUsers.push(...Allusersresult);
        // this.userData.push(...Allusersresult);
    }

    /**
     * Checks if the user is logged in by verifying the token.
     */
    private async checkIfLoggedIn(): Promise<void> {
        const token: any | null = this._tokenService.getToken();

        if (token) {
            this._isLoggedIn = true;
        } else {
            this._isLoggedIn = false;
        }

        if (this._isLoggedIn) {
            await this.getOrderItems();
            if (this.userData.length === 0) {
                await this.getUserInfo();
            }
        }

        if (this._isLoggedIn && this.userData.length > 0 && this.userData[0].authorization_level_id === 3) {
            await this.getAllUsers();
        }
    }

    /**
     * Handler for the "Add to wishlist"button
     *
     * @param orderItem Order item to add to the cart
     */
    private async addItemToWishlist(wishItem: WishItem): Promise<void> {
        const result: number | undefined = await this._userService.addItemToWishlist(wishItem);

        if (!result) {
            return;
        }

        this._wishlistItemsCount = result;
    }

    /**
     * Handler for the login form
     */
    private async submitLoginForm(): Promise<void> {
        // TODO: Validation

        const result: boolean = await this._userService.login({
            email: this._email,
            password: this._password,
        });

        if (result) {
            alert("Succesfully logged in!");

            await this.checkIfLoggedIn();

            await this.getUserInfo();

            this._currentPage = RouterPage.Home;
        } else {
            alert("Failed to login!");
        }
    }

    /**
     * Handler for the register form
     */
    private async submitRegisterForm(): Promise<void> {
        //check if email is valid
        const emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(this._email)) {
            alert("Invalid email address");
            return;
        }

        const result: boolean = await this._userService.register({
            email: this._email,
            password: this._password,
            voornaam: this._voornaam,
            achternaam: this._achternaam,
        });

        if (result) {
            alert("Succesfully registered!");

            this._currentPage = RouterPage.Login;
        } else {
            alert("Failed to register!");
        }
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
     * Handler for the logout button
     */
    private async clickLogoutButton(): Promise<void> {
        await this._userService.logout();

        this._tokenService.removeToken();

        this._isLoggedIn = false;
    }

    private constructor() {
        super();
        // Listen for the 'cartUpdated' event
        console.log("Root constructor called"); // New console.log statement
        window.addEventListener("cartUpdated", (event: Event) => {
            this._cartItemsCount = (event as CustomEvent).detail.cartItemsCount;
        });
        window.addEventListener("cartUpdated", this.handleCartUpdated.bind(this));
    }

    private handleCartUpdated(event: Event): void {
        this._cartItemsCount = (event as CustomEvent).detail.cartItemsCount;
        this.loadCartItems().catch((error) => {
            console.error("Error loading cart items:", error);
        });
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        // Remove the event listener when the component is removed
        window.removeEventListener("cartUpdated", this.handleCartUpdated.bind(this));
    }

    /**
     * Handler for the "Add to cart"button
     *
     * @param orderItem Order item to add to the cart
     */
    private async addItemToCart(orderItem: OrderItem): Promise<void> {
        await this.loadCartItems();
        this._cartItemsCount += 1;
        const result: number | undefined = await this._userService.addOrderItemToCart(orderItem);

        if (!result) {
            return;
        }

        this._cartItemsCount = result;
    }

    /**
     * Renders the component.
     *
     * @returns TemplateResult
     */
    protected render(): TemplateResult {
        let contentTemplate: TemplateResult;

        switch (this._currentPage) {
            case RouterPage.Login:
                contentTemplate = this.renderLogin();
                break;
            case RouterPage.Register:
                contentTemplate = this.renderRegister();
                break;
            case RouterPage.Games:
                contentTemplate = this.renderGamesPage();
                break;
            case RouterPage.Merchandise:
                contentTemplate = this.renderMerchandisePage();
                break;
            case RouterPage.Cart:
                contentTemplate = this.renderCartPage();
                break;
            case RouterPage.Wishlist:
                contentTemplate = this.renderWishlistPage();
                break;
            case RouterPage.Account:
                contentTemplate = this.renderAccountPage();
                break;
            case RouterPage.product:
                contentTemplate = this.renderProductPage();
                break;
            case RouterPage.checkout:
                contentTemplate = this.renderCheckoutPage();
                break;
            case RouterPage.order:
                contentTemplate = this.renderOrderPage();
                break;
            case RouterPage.myOrders:
                contentTemplate = this.renderMyOrdersPage();
                break;

            default:
                contentTemplate = this.renderHome();
        }

        return html`
        <header>
        <nav>
    <div class="nav-left">
        <!-- Logo -->
        <div class="logo" @click=${(): void => {
            this._currentPage = RouterPage.Home;
        }}>
            <img src="/assets/img/logo.png" alt="Logo" />
        </div>
        ${this.renderHomeInNav()}
        ${this.renderGamesInNav()}
        ${this.renderMerchendiseInNav()}
        ${this.renderHomeInNavAfterLogin()}
        ${this.renderGamesInNavAfterLogin()}
        ${this.renderMerchendiseInNavAfterLogin()}
        ${this.renderAccountInNavAfterLogin()}
    </div>
    <div class="search-bar">
        ${this.renderSearchbarInNav()}
    </div>
    <div class="nav-right">
        ${this.renderMyOrdersInNavAfterLogin()}
        ${this.renderLoginInNav()}
        ${this.renderRegisterInNav()}
        ${this.renderWishlistInNav()}
        ${this.renderShoppingcartInNav()}
        ${this.renderLogoutInNav()}
    </div>
</nav>

                </div>
            </header>
            <section></section>
            <main>${contentTemplate}</main>
            <footer>
    ${
        this._isLoggedIn
            ? html`
                  <button class="subscribe" @click=${this.subscribeToNewsletter}>
                      Subscribe to Newsletter
                  </button>
              `
            : nothing
    }
    Copyright &copy; Luca Stars 2024
</footer>
        `;
    }

    /**
     * Subscribes the user to the newsletter.
     * Calls the `updateNewsletterStatus` method of `_userService` with `true` to indicate that the user wants to subscribe.
     * If the operation is successful, it forces a re-render of the component.
     * @returns {Promise<void>} A Promise that resolves when the operation is complete.
     */
    private async subscribeToNewsletter(): Promise<void> {
        const result: UserData[] | undefined = await this._userService.getAllUserInfo();
        console.log("subscribeToNewsletter called"); // New console.log statement
        // Assuming userService is a property of Root that provides methods for interacting with the user on the server side
        console.log(result, "lol");
        try {
            if (result && result.length > 0 && Boolean(result[0].newsletter_status) === false) {
                await this._userService.updateNewsletterStatus(true);
                await this.sendEmailBasedOnStatus(true); // Call the email function with status true
            }
        } catch (error) {
            console.error("Error updating newsletter status:", error); // Log any errors
        }
        // Force a re-render to update the button state in the template
        this.requestUpdate();
    }
    /**
     * Renders the cart page.
     * @returns {TemplateResult} The HTML template for the cart page.
     */
    private renderCartPage(): TemplateResult {
        return html`
            ${this._currentPage === RouterPage.Cart
                ? html`
                      <shopping-cart
                          .isLoggedIn=${this._isLoggedIn}
                          .navigateToCheckout=${this.navigateToCheckout.bind(this)}
                      ></shopping-cart>
                  `
                : nothing}
        `;
    }

    /**
     * Loads the items in the user's cart.
     * Calls the `getCart` method of `_userService` to get the items in the user's cart.
     * @returns {Promise<void>} A Promise that resolves when the operation is complete.
     */
    private async loadCartItems(): Promise<void> {
        const result: UserCartResponse | undefined = await this._userService.getCart();
        if (result && result.cartItems) {
            this._cartItemsCount = result.cartItems.reduce((total, item) => total + item.quantity, 0);
        } else {
            this._cartItemsCount = 0;
        }
    }

    /**
     * Renders the searchbar in the navigation.
     *
     * @returns TemplateResult
     */
    private renderSearchbarInNav(): TemplateResult {
        return html` 
        <search-page
            .navigateToProductPage=${this.navigateToProductPage.bind(this)}
        ></search-page>`;
    }

    /**
     * Handles the click event for the cart button.
     */
    private handleClickCartButton(): void {
        if (!this._isLoggedIn) {
            alert("You need to be logged in to view the cart.");
            return;
        }
        this._currentPage = RouterPage.Cart;
    }

    /**
     * Renders the shopping cart button in the navigation.
     *
     * @returns TemplateResult
     */

    // src/web/src/components/Root.ts
    private renderShoppingcartInNav(): TemplateResult {
        return html` <div class="cart" @click=${this.handleClickCartButton}>
            <img src="/assets/img/cart.png" alt="shopping cart" />
            <div class="cart-items-count">${this._cartItemsCount}</div>
        </div>`;
    }

    

    private renderWishlistPage(): TemplateResult {
        return html`
            ${this._currentPage === RouterPage.Wishlist
                ? html`
                      <wish-list
                          .isLoggedIn=${this._isLoggedIn}
                          .navigateToCheckout=${this.navigateToCheckout.bind(this)}
                      ></wish-list>
                  `
                : nothing}
        `;
    }

    /**
     * Handles the click event for the wishlist button.
     */
    private handleClickWishlistButton(): void {
        this._currentPage = RouterPage.Wishlist;
    }

    /**
     * Renders the wishlist button in the navigation.
     *
     * @returns TemplateResult
     */
    private renderWishlistInNav(): TemplateResult {
        return html` <div class="cart" @click=${this.handleClickWishlistButton}>
            <img src="/assets/img/hartje.jpg" alt="Wish list" />
        </div>`;
    }

    /**
     * Handles changes to the newsletter subscription checkbox.
     * @param {Event} event - The event object from the checkbox input.
     * @returns {Promise<void>} A Promise that resolves when the operation is complete.
     */
    /**
     * Renders the home page.
     *
     * @returns TemplateResult
     */
    private renderHome(): TemplateResult {
        const renderItems: any = (items: OrderItem[]) => {
            return items.map(
                (item) => html`
                    <div class="order-item">
                        <h2>${item.name}</h2>
                        <p>${item.description}</p>
                        <p>&euro; ${item.price}</p>
                        <img src="${item.image_urls}" alt="${item.name}" />
                        ${this._isLoggedIn
                            ? html`
                                  <div class="button-group">
                                      <button
                                          class="order-button"
                                          @click=${async (): Promise<void> => await this.addItemToCart(item)}
                                      >
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
                              `
                            : nothing}
                    </div>
                `
            );
        };

        return html`
            <h1>Welcome to Luca Stars webshop!</h1>
            <p>Discover our great collection of games and merchandise.</p>

            <h2>Featured Games</h2>
            <div class="order-items">${renderItems(this._gamesFeatured)}</div>

            <h2>Featured Merchandise</h2>
            <div class="order-items">${renderItems(this._merchandiseFeatured)}</div>

            <section class="about-us">
                <h2>About Us</h2>
                <p>
                    Welcome to Luca Stars webshop, your number one source for all things games and
                    merchandise. We're dedicated to giving you the very best of our products, with a focus on
                    quality, customer service, and uniqueness.
                </p>
                <p>
                    Founded in 2024 by Luca, Luca Stars has come a long way from its beginnings. When Luca
                    first started out, his passion for eco-friendly products drove him to do tons of research
                    so that Luca Stars can offer you the world's most advanced products. We now serve
                    customers all over the world and are thrilled that we're able to turn our passion into our
                    own website.
                </p>
                <p>
                    We hope you enjoy our products as much as we enjoy offering them to you. If you have any
                    questions or comments, please don't hesitate to contact us.
                </p>
                <p>Sincerely,<br />Luca</p>
            </section>
        `;
    }

    /**
     * Renders the login page.
     *
     * @returns TemplateResult
     */
    private renderLogin(): TemplateResult {
        return html`
            <div class="form">
                ${this.renderEmail()} ${this.renderPassword()}

                <div>
                    <button @click="${this.submitLoginForm}" type="submit">Log in</button>
                </div>

                <div>
                    Of
                    <button
                        @click="${(): void => {
                            this._currentPage = RouterPage.Register;
                        }}"
                    >
                        Register
                    </button>
                    by pressing here.
                </div>
            </div>
        `;
    }

    /**
     * Renders the register page.
     *
     * @returns TemplateResult
     */
    private renderRegister(): TemplateResult {
        return html`
            <div class="form">
                <div>
                    <label for="username">first name</label>
                    <input
                        type="text"
                        id="voornaam"
                        value=${this._voornaam}
                        @change=${this.onChangeVoorNaam}
                    />
                </div>

                <div>
                    <label for="achternaam">last name</label>
                    <input
                        type="text"
                        id="achternaam"
                        value=${this._achternaam}
                        @change=${this.onChangeAchterNaam}
                    />
                </div>
                ${this.renderEmail()} ${this.renderPassword()}
                <div>
                    <button @click="${this.submitRegisterForm}" type="submit">Register</button>
                </div>

                <div>
                    Or
                    <button
                        @click="${(): void => {
                            this._currentPage = RouterPage.Login;
                        }}"
                    >
                        log in
                    </button>
                    by pressing here.
                </div>
            </div>
        `;
    }

    /**
     * Renders the Games page.
     * @returns TemplateResult
     */

    private renderGamesPage(): TemplateResult {
        return html`
            <games-page
                .games=${this._games}
                .addItemToCart=${this.addItemToCart.bind(this)}
                .addItemToWishlist=${this.addItemToWishlist.bind(this)}
                .navigateToProductPage=${this.navigateToProductPage.bind(this)}
            ></games-page>
        `;
    }

    /**
     * Renders the Merchandise page.
     * @returns TemplateResult
     */

    private renderMerchandisePage(): TemplateResult {
        return html`
            <merchandise-page
                .merchandiseItems=${this._merchandise}
                .addItemToCart=${this.addItemToCart.bind(this)}
                .addItemToWishlist=${this.addItemToWishlist.bind(this)}
                .navigateToProductPage=${this.navigateToProductPage.bind(this)}
            ></merchandise-page>
        `;
    }

    /**
     * Renders the Account page.
     * @returns TemplateResult
     */

    private renderProductPage(): TemplateResult {
        return html`
            <product-page
                .productDetails=${this.productDetails}
                .merchandiseItems=${this._merchandise}
                .navigateBack=${this.navigateBack.bind(this)}
                .addItemToCart=${this.addItemToCart.bind(this)}
                .addItemToWishlist=${this.addItemToWishlist.bind(this)}
                .navigateToProductPage=${this.navigateToProductPage.bind(this)}
            ></product-page>
        `;
    }

    public async sendEmailBasedOnStatus(status: boolean): Promise<void> {
        if (!this.userData || this.userData.length === 0) {
            console.error("No user data available");
            return;
        }

        const user: UserData = this.userData[0];
        let emailPayload: any;

        if (status) {
            emailPayload = {
                from: { name: "luca stars", address: "no-reply@lucastarsstore.com" },
                to: [{ address: user.email }],
                subject: "Thank you for joining our newsletter!",
                text: `Dear ${user.firstName},\n\nThank you for subscribing to the newsletter!\n\nKind regards,\nLuca Stars`,
            };
        } else {
            emailPayload = {
                from: { name: "luca stars", address: "no-reply@lucastarsstore.com" },
                to: [{ address: user.email }],
                subject: "We're sad to see you leave...",
                text: `Dear ${user.firstName},\n\nWe're sorry to see you unsubscribe from our newsletter. If you change your mind, we'll be here!\n\nKind regards,\nLuca Stars`,
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

    /**
     * Renders the checkout page.
     * @returns TemplateResult
     */

    private renderCheckoutPage(): TemplateResult {
        return html`
            <checkout-component
                .userdata=${this.userData}
                .totalPrice=${this.totalPrice}
                .cartItems=${this.cartItems}
                .cart_id=${this.cart_id}
                .navigateToOrderPage=${this.navigateToOrderPage.bind(this)}
            >
            </checkout-component>
        `;
    }

    private renderOrderPage(): TemplateResult {
        return html`
            <order-complete
                .userdata=${this.userData}
                .totalPrice=${this.totalPrice}
                .cartItems=${this.cartItems}
                .selectedAddress=${this.selectedAddress}
            ></order-complete>
        `;
    }

    private renderMyOrdersPage(): TemplateResult {
        return html` <my-orders .orderItems=${this._orderItems} .userdata=${this.userData}></my-orders> `;
    }

    /**
     * Navigates to the product page for the orderItem clicked on.
     *
     * @param orderItem Order item to view details of
     */
    private navigateToProductPage(orderItem: OrderItem): void {
        this.productDetails = orderItem;
        this._currentPage = RouterPage.product;
    }

    private navigateToCheckout(totalPrice: number, cartitems: CartItem[], cart_id: number): void {
        this.cart_id = cart_id;
        this.totalPrice = totalPrice;
        this.cartItems = cartitems;
        this._currentPage = RouterPage.checkout;
    }

    private navigateToPage(item: product): void {
        this.productDetails = item;
        this._currentPage = RouterPage.product;
    }

    private navigateToOrderPage(selectedAddress: Address): void {
        this.selectedAddress = selectedAddress;
        this._currentPage = RouterPage.order;
    }

    // private navigateToMyOrders(): void {
    //     this._currentPage = RouterPage.myOrders;
    // }

    /**
     * Renders the home button in the navigationbar.
     *
     * @returns TemplateResult
     */
    private renderHomeInNav(): TemplateResult {
        if (this._isLoggedIn) {
            return html``;
        }

        return html`<div
            @click=${(): void => {
                this._currentPage = RouterPage.Home;
            }}
        >
            <button class="nav-link">Home</button>
        </div>`;
    }

    /**
     * Renders the home button in the navigationbar after login.
     *
     * @returns TemplateResult
     */
    private renderHomeInNavAfterLogin(): TemplateResult {
        if (!this._isLoggedIn) {
            return html``;
        }

        return html`<div
            @click=${(): void => {
                this._currentPage = RouterPage.Home;
            }}
        >
            <button class="nav-link">Home</button>
        </div>`;
    }

    /**
     * Renders the games button in the navigationbar.
     *
     * @returns TemplateResult
     */
    private renderGamesInNav(): TemplateResult {
        if (this._isLoggedIn) {
            return html``;
        }

        return html`<div
            @click=${(): void => {
                this._currentPage = RouterPage.Games;
            }}
        >
            <button class="nav-link">Games</button>
        </div>`;
    }

    /**
     * Renders the games button in the navigationbar after login.
     *
     * @returns TemplateResult
     */
    private renderGamesInNavAfterLogin(): TemplateResult {
        if (!this._isLoggedIn) {
            return html``;
        }

        return html`<div
            @click=${(): void => {
                this._currentPage = RouterPage.Games;
            }}
        >
            <button class="nav-link">Games</button>
        </div>`;
    }

    /**
     * Renders the merchandise button in the navigationbar.
     *
     * @returns TemplateResult
     */
    private renderMerchendiseInNav(): TemplateResult {
        if (this._isLoggedIn) {
            return html``;
        }
        return html`<div
            @click=${(): void => {
                this._currentPage = RouterPage.Merchandise;
            }}
        >
            <button class="nav-link">Merchandise</button>
        </div>`;
    }

    /**
     * Renders the merchandise button in the navigationbar after login.
     *
     * @returns TemplateResult
     */
    private renderMerchendiseInNavAfterLogin(): TemplateResult {
        if (!this._isLoggedIn) {
            return html``;
        }

        return html`<div
            @click=${(): void => {
                this._currentPage = RouterPage.Merchandise;
            }}
        >
            <button class="nav-link">Merchandise</button>
        </div>`;
    }

    /**
     * Renders the account button in the navigationbar after login.
     *
     * @returns TemplateResult
     */
    private renderAccountInNavAfterLogin(): TemplateResult {
        if (!this._isLoggedIn) {
            return html``;
        }

        return html`<div
            @click=${(): void => {
                this._currentPage = RouterPage.Account;
            }}
        >
            <button class="nav-link">Account</button>
        </div>`;
    }

    private renderMyOrdersInNavAfterLogin(): TemplateResult {
        if (!this._isLoggedIn) {
            return html``;
        }

        return html`<div
            @click=${(): void => {
                this._currentPage = RouterPage.myOrders;
            }}
        >
            <button class="nav-link">my orders</button>
        </div>`;
    }

    /**
     * Renders the login button in the navigationbar.
     *
     * @returns TemplateResult
     */
    private renderLoginInNav(): TemplateResult {
        if (this._isLoggedIn) {
            return html``;
        }

        return html`<div
            @click=${(): void => {
                this._currentPage = RouterPage.Login;
            }}
        >
            <button class="login-button">Log in</button>
        </div>`;
    }

    /**
     * Renders the register button in the navigationbar.
     *
     * @returns TemplateResult
     */
    private renderRegisterInNav(): TemplateResult {
        if (this._isLoggedIn) {
            return html``;
        }

        return html` <div
            @click=${(): void => {
                this._currentPage = RouterPage.Register;
            }}
        >
            <button class="register-button">Register</button>
        </div>`;
    }

    /**
     * Renders the logout button in the navigationbar.
     *
     * @returns TemplateResult
     */
    private renderLogoutInNav(): TemplateResult {
        if (!this._isLoggedIn) {
            return html``;
        }

        return html`
            <div @click=${this.clickLogoutButton}>
                <button class="logout-button">Log out</button>
            </div>
        `;
    }

    /**
     * Renders the password input field with change-tracking.
     *
     * @returns TemplateResult
     */
    private renderPassword(): TemplateResult {
        return html`<div>
            <label for="password">Password</label>
            <input type="password" value=${this._password} @change=${this.onChangePassword} />
        </div>`;
    }

    /**
     * Renders the email input field with change-tracking.
     *
     * @returns TemplateResult
     */
    private renderEmail(): TemplateResult {
        return html`<div>
            <label for="email">E-mail</label>
            <input
                type="text"
                name="email"
                placeholder="test@test.nl"
                value=${this._email}
                @change=${this.onChangeEmail}
            />
        </div>`;
    }

    /**
     * Handles changes to the email input field.
     *
     * @param event Input event
     */
    private onChangeEmail(event: InputEvent): void {
        this._email = (event.target as HTMLInputElement).value;
    }

    /**
     * Handles changes to the password input field.
     *
     * @param event Input event
     */
    private onChangePassword(event: InputEvent): void {
        this._password = (event.target as HTMLInputElement).value;
    }

    /**
     * Handles changes to the first name input field.
     *
     * @param event Input event
     */
    private onChangeVoorNaam(event: InputEvent): void {
        this._voornaam = (event.target as HTMLInputElement).value;
    }

    /**
     * Handles changes to the last name input field.
     *
     * @param event Input event
     */
    private onChangeAchterNaam(event: InputEvent): void {
        this._achternaam = (event.target as HTMLInputElement).value;
    }

    private navigateBack(category: string): void {
        if (category === "Game") {
            this._currentPage = RouterPage.Games;
        } else if (category === "Merchandise") {
            this._currentPage = RouterPage.Merchandise;
        } else {
            this._currentPage = RouterPage.Home;
        }
    }

    private renderAccountPage(): TemplateResult {
        return html`
            <account-page
                .userData=${this.userData}
                .AllUsers=${this.AllUsers}
                .isLoggedIn=${this._isLoggedIn}
                ._userService=${this._userService}
                .navigateToPage=${this.navigateToPage.bind(this)}
            ></account-page>
        `;
    }
}
