export class TokenService {
    private static readonly EXPIRY_KEY = "tokenExpiry";

    /**
     * Store the current JWT token in local storage
     * 
     * @param token The current JWT token
     */
    public setToken(token: string): void {
        const expiryTime: number = this.getTokenExpiry(token);
        localStorage.setItem("token", token);
        localStorage.setItem(TokenService.EXPIRY_KEY, expiryTime.toString());
    }

    /**
     * Retrieve the stored JWT token from local storage
     * 
     * @returns JWT token when successful and not expired, otherwise `undefined`.
     */
    public getToken(): string | undefined {
        const token: string | null = localStorage.getItem("token");
        const expiry: string | null = localStorage.getItem(TokenService.EXPIRY_KEY);

        if (token && expiry && !this.isTokenExpired(parseInt(expiry))) {
            return token;
        }
        this.removeToken();
        return undefined;
    }

    /**
     * Remove the JWT token from local storage
     */
    public removeToken(): void {
        localStorage.removeItem("token");
        localStorage.removeItem(TokenService.EXPIRY_KEY);
    }

    /**
     * Check if the JWT token is expired
     * 
     * @param expiryTime The expiry time in milliseconds
     * @returns `true` if the token is expired, otherwise `false`.
     */
    private isTokenExpired(expiryTime: number): boolean {
        return Date.now() > expiryTime;
    }

    /**
     * Decode the JWT token and extract the expiration time
     * 
     * @param token The JWT token
     * @returns The expiration time in milliseconds
     */
    private getTokenExpiry(token: string): number {
        try {
            const decodedToken: any = JSON.parse(atob(token.split(".")[1]));
            return decodedToken.exp * 1000; // Convert expiry time to milliseconds
        } catch (e) {
            // If there's an error in decoding, consider the token invalid and already expired
            return Date.now() - 1;
        }
    }
}
