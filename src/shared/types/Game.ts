import { product } from "./product";
 
export type Game = {
    game_id?: number;
    product_id:number;
    platform?: string; // Added for game category
    release_date?: string; // Added for game category
    name?: product[];
    price?: product[];
    inventory_quantity?: product[];
    average_rating?: product[];
    category?: product[];
    description?: product[];
    image_urls?: product[];
};