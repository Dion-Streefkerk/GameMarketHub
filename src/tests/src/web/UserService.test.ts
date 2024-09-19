/**
 * @vitest-environment jsdom
 */
import { expect, it, describe, beforeEach, vi } from "vitest";
import { UserService } from "../../../web/src/services/UserService";
import { TokenService } from "../../../web/src/services/TokenService";

// @ts-expect-error Mock
global.viteConfiguration = { API_URL: "/" };

const userService: UserService = new UserService();
const tokenService: TokenService = new TokenService();

describe("User service", () => {
    beforeEach(() => {
        // Enable mocking fetch for these tests
        fetchMock.doMock();

        // Every test should start with cleared mocks
        vi.clearAllMocks();
    });

    it("login does correct fetch to API", async () => {
        fetchMock.mockResponse(() => {
            return { status: 400 };
        });

        await userService.login({
            email: "test-email",
            password: "test-password",
        });

        const request: Request = fetchMock.requests()[0];
        //@ts-expect-error Mock
        const requestBody: any = JSON.parse(request.body.toString());

        expect(request.url).toBe("/users/login");
        expect(requestBody.email).toBe("test-email");
        expect(requestBody.password).toBe("test-password");
    });

    it("login fails", async () => {
        // Arrange
        fetchMock.mockResponse(() => {
            return { status: 400 };
        });

        // Act
        const result: boolean = await userService.login({
            email: "test",
            password: "test",
        });

        // Assert
        expect(result).toBeFalsy();
    });

    it("login successful without valid token", async () => {
        // Arrange
        fetchMock.mockResponse(() => {
            return { 
                status: 200, 
                body: JSON.stringify({}) 
            };
        });

        // Act
        const result: boolean = await userService.login({
            email: "test",
            password: "test",
        });

        // Assert
        expect(result).toBeFalsy();
    });

    it("login successful with valid token", async () => {
        // Arrange
        fetchMock.mockResponse(() => {
            return { 
                status: 200, 
                body: JSON.stringify({
                    token: "test-token"
                }) 
            };
        });

        // Act
        const result: boolean = await userService.login({
            email: "test",
            password: "test",
        });

        // Assert
        expect(tokenService.getToken()).toBe("test-token");
        expect(result).toBeTruthy();
    });
});
