import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { OrderItem } from "@shared/types/OrderItem"; // Adjust the path as necessary
import { UserService } from "../services/UserService"; // Adjust import path as necessary
import { WishItem } from "@shared/types";

/**
 * @element product-page
 * @extends LitElement
 *
 * This component represents a product page displaying product details and related merchandise items.
 */
@customElement("product-page")
export class ProductPageComponent extends LitElement {
    /**
     * Styles for the product page component.
     * @internal
     */
    public static styles = css`
        .product-details {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .product-details h2 {
            font-size: 2em;
            margin: 10px 0;
            color: #333;
        }

        .product-details p {
            font-size: 1.2em;
            color: #555;
            margin: 10px 0;
        }

        .product-details img {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
            margin-top: 20px;
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
            border-radius: 5px;
        }

        .back-button:hover {
            background-color: #aaa;
        }

        .order-button {
            align-self: flex-start;
            background-color: #4caf50;
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: flex;
            font-size: 16px;
            margin: 4px 2px;
            justify-content: center;
            cursor: pointer;
            transition-duration: 0.4s;
            border-radius: 5px;
        }

        .order-button:hover {
            background-color: #45a049;
        }

        .merchandise-list {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
            margin-top: 20px;
        }

        .merchandise-item {
            flex: 1 1 calc(25% - 20px);
            box-sizing: border-box;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            padding: 15px;
            background: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .merchandise-item:hover {
            transform: translateY(-10px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .merchandise-item img {
            width: 100%;
            height: 250px; /* Increase the height to make images taller */
            object-fit: cover;
            border-radius: 10px;
            margin-bottom: 10px;
        }

        .merchandise-item h3 {
            font-size: 18px;
            margin: 10px 0;
            color: #333;
        }

        .merchandise-item p {
            font-size: 14px;
            color: #777;
            margin: 10px 0;
        }

        .merchandise-item-price {
            font-size: 16px;
            font-weight: bold;
            margin: 10px 0;
        }

        .view-details-button {
            background-color: #0056b3;
            border: none;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin: 4px 2px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            border-radius: 5px;
        }

        .view-details-button:hover {
            opacity: 0.7;
        }

        .wishlist-button {
            background-color: orange;
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: flex;
            font-size: 16px;
            margin: 4px 2px;
            justify-content: center;
            cursor: pointer;
            transition-duration: 0.4s;
            border-radius: 5px;
        }

        .review-form {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        .review-form textarea {
            width: 100%;
            height: 100px;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            border: 1px solid #ccc;
        }

        .review-form input[type="number"] {
            width: 100px;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            border: 1px solid #ccc;
        }

        .submit-review-button {
            background-color: #4caf50;
            border: none;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin: 10px 2px;
            cursor: pointer;
            transition-duration: 0.4s;
            border-radius: 5px;
        }

        .submit-review-button:hover {
            background-color: #45a049;
        }

        .product-reviews-list {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
            margin-top: 20px;
        }

        .review-item {
            flex: 1 1 calc(25% - 20px);
            box-sizing: border-box;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            padding: 15px;
            background: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .review-item:hover {
            transform: translateY(-10px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .review-item img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 10px;
            margin-bottom: 10px;
        }

        .review-item h3 {
            font-size: 18px;
            margin: 10px 0;
            color: #333;
        }

        .review-item p {
            font-size: 14px;
            color: #777;
            margin: 10px 0;
        }

        .review-item-price {
            font-size: 16px;
            font-weight: bold;
            margin: 10px 0;
        }

        @media (max-width: 1200px) {
            .merchandise-item, .review-item {
                flex: 1 1 calc(33.33% - 20px);
            }
        }

        @media (max-width: 992px) {
            .merchandise-item, .review-item {
                flex: 1 1 calc(50% - 20px);
            }
        }

        @media (max-width: 768px) {
            .merchandise-item, .review-item {
                flex: 1 1 100%;
            }
        }
    `;

    @property({ type: Object })
    public productDetails: OrderItem | null = null;

    @property({ type: Array })
    public merchandiseItems: OrderItem[] | null = null;

    @property({ type: Function })
    public navigateBack!: (category: string) => void;

    @property({ type: Function })
    public addItemToCart!: (orderItem: OrderItem) => Promise<void>;

    @property({ type: Function })
    public addItemToWishlist!: (wishItem: WishItem) => Promise<void>;

    @property({ type: Function })
    public navigateToProductPage!: (orderItem: OrderItem) => void;

    @property({ type: Function })
    public addReview!: (productId: number, review: { rating: number; comment: string }) => Promise<boolean>;

    @state()
    private reviewComment: string = "";

    @state()
    private shouldFetchReviews: boolean = true;

    @state()
    private reviews: any[] = [];

    @state()
    private _userService: UserService = new UserService();

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        this.shouldFetchReviews = true; // Fetch reviews when component is first connected
        await this.fetchReviews();
    }

    private handleBackClick(): void {
        if (this.productDetails) {
            if (this.productDetails.category)
                this.navigateBack(this.productDetails.category);
        } else {
            this.navigateBack("");
        }
        if(this.shouldFetchReviews) {
        }
    }

    private async handleAddToCartClick(): Promise<void> {
        if (this.productDetails) {
            await this.addItemToCart(this.productDetails);
        }
    }

    private async handleAddToWishList(): Promise<void> {
        if (this.productDetails) {
            const wishItem: WishItem = {
                wishlist_id: 0, // Assuming the wishlist ID is not needed for the request
                product_id: this.productDetails.product_id,
                // Other properties if needed
            };
            await this.addItemToWishlist(wishItem);
        }
    }

    private async handleSubmitReview(): Promise<void> {

        if (!this.productDetails) {
            console.error("No product details available.");
            return;
        }

        const review: any = this.reviewComment;


        if (!this._userService.addReview) {
            console.error("Add review function is not defined.");
            return;
        }

        try {
            const success: boolean = await this._userService.addReview(this.productDetails.product_id, review);

            if (success) {
                console.log("Review submitted successfully");
                this.reviewComment = "";
                this.shouldFetchReviews = true; // Set flag to fetch reviews after a successful submission
                await this.fetchReviews(); // Fetch reviews after successful submission
            } else {
                console.error("Failed to submit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    }

    private async fetchReviews(): Promise<void> {
        try {

            if (!this.productDetails || !this.productDetails.product_id) {
                console.log("Product ID is not available.");
                this.reviews = [];
                return;
            }

            // Fetch product reviews from the backend
            this.reviews = await this._userService.getAllProductReviews(this.productDetails.product_id);
            this.shouldFetchReviews = false; // Set flag to false after fetching reviews
        } catch (error: any) {
            console.error("Error fetching product reviews:", error);
            this.reviews = [];
        }
    }

    private handleReviewInput(e: Event): void {
        const textarea: any = e.target as HTMLTextAreaElement;
        this.reviewComment = textarea.value;
    }

    private renderProductReviews(): TemplateResult {
        if (this.reviews.length === 0) {
            return html`<p>No reviews available for this product.</p>`;
        }

        return html`
            <h2>Product Reviews</h2>
            <div class="product-reviews-list">
                ${this.reviews.map(review => html`
                    <div class="review-item">
                        <p><strong>User Name:</strong> ${review.name}</p>
                        <p><strong>Review Text:</strong> ${review.review_text}</p>
                        <p><strong>Review Date:</strong> ${review.review_date}</p>
                    </div>
                `)}
            </div>
        `;
    }

    public render(): TemplateResult {
        if (!this.productDetails) {
            return html`<p>Loading...</p>`;
        }
        const gameMerchandise: any = this.merchandiseItems?.filter(
            (item) => item.game_id === this.productDetails!.game_id
        );

        return html`
            <button class="back-button" @click=${this.handleBackClick}>Back</button>
            <h1>Product Page</h1>
            <div class="product-details">
                <h2>${this.productDetails.name}</h2>
                <p>${this.productDetails.description}</p>
                <p>Price: &euro; ${this.productDetails.price}</p>
                <button class="order-button" @click=${this.handleAddToCartClick}>Add to Cart</button>
                <br />
                <button class="wishlist-button" @click=${this.handleAddToWishList}>Add to wishlist</button>
                <br />
                <img src="${this.productDetails.image_urls}" alt="${this.productDetails.name}" />
            </div>
            ${gameMerchandise && gameMerchandise.length > 0
                ? html`
                      <div class="merchandise-list">
                          ${gameMerchandise.map(
                              (merch: any) => html`
                                  <div class="merchandise-item">
                                      <img src="${merch.image_urls}" alt="${merch.name}" />
                                      <div>
                                          <h3>${merch.name}</h3>
                                          <p>Price: &euro; ${merch.price}</p>
                                          <button
                                              class="view-details-button"
                                              @click=${(): void => this.navigateToProductPage(merch)}
                                          >
                                              View Details
                                          </button>
                                      </div>
                                  </div>
                              `
                          )}
                      </div>
                  `
                : ""}

            <div class="review-form">
                <h2>Leave a Review</h2>
                <textarea placeholder="Your comment" .value=${this.reviewComment} @keyup=${this.handleReviewInput}></textarea>
                <button class="submit-review-button" @click=${this.handleSubmitReview}>Submit Review</button>
            </div>

            ${this.renderProductReviews()}
        `;
    }
}
