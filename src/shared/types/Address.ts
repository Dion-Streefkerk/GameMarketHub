import { UserData } from "./UserData";
 
export type Address = {
    address_id: number;
    type?: string;
    street: string;
    city: string;
    zip: string;
    country: string;
    user_id?: UserData[];
};
 