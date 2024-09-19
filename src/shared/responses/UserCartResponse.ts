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
