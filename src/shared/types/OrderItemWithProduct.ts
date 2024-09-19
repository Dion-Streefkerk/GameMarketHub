export interface  OrderItemWithProduct {
    order_item_id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    date_created: string;
    name: string;
    description: string;
    image_urls: string;
}