import { Address } from "./Address";
import { CartItem } from "./CartItem";
import { Order } from "./Order";

export type UserData = {
    user_id: number;
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    newsletter_status: boolean | null;
    authorization_level_id: number;
    address?: Address[];
    orders?: Order[];
    cart?: CartItem[];
};
