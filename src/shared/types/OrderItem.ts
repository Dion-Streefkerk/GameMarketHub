import { product } from "./product";

export type OrderItem = {
    order_id(order_id: any): unknown;
    cart_item_id: number;
    cart_id: number;
    product_id: number;
    game_id: number | null;
    name: string;
    quantity: number;
    price: number;
    date_created: Date;
    category: product["category"];
    description: product["description"];
    image_urls: product["image_urls"];
};
