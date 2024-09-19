export type UserWishlistResponse = {
    email: string;
    wishlistItems:
        | {
              wishlist_id: number;
              product_id: number;
              name: string;
              price: number;
              description: string;
              image_urls: string;
              quantity: number;
          }[]
        | undefined;
};
