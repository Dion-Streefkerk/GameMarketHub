export type cart = {
    product_id: number;
    name: string;
    description?: string;
    price: number;
    category: string;
    image_urls?: string[];
};