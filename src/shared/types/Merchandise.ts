import { product } from "./product";
 
 
export type Merchandise = {
    merchandise_id?: number;
    game_id?: number;
    product_id:number;
    size?: string; // Added for merchandise category
    color?: string; // Added for merchandise category
    name?: product[];
    price?: product[];
    inventory_quantity?: product[];
    average_rating?: product[];
    category?: product [] ;
    description?: product[];
    image_urls?: product[];
};