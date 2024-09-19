import { Game } from "./Game";
import { Merchandise } from "./Merchandise";
 
export type product = {
    product_id?: number;
    name?: string;
    price?: number;
    inventory_quantity?: number;
    average_rating?: number;
    category?: string;
    description?: string;
    image_urls?: string;
    game_id?: Game[];
    platform?: Game[];
    release_date?: Game[];
    merchandise_id?: Merchandise[];
    size?: Merchandise[];
    color?: Merchandise[];
};