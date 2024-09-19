import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response } from "express";
import { getConnection, queryDatabase } from "../../../api/src/controllers/services/databaseService";
import { UserController } from "../../../api/src/controllers/UserController";

vi.mock("../../../api/src/controllers/services/databaseService");

describe("UserController", () => {
    let controller: UserController;

    beforeEach(() => {
        controller = new UserController();
        vi.resetAllMocks();
    });

    describe("addProduct", () => {
        it("should return 400 if the product type is invalid", async () => {
            const req: Request = {
                body: { productType: "invalidType" }
            } as any as Request;
            const res: Response = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn()
            } as any as Response;

            await controller.addProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid product type." });
        });

        it("should return 500 if the product insertion fails", async () => {
            const req: Request = {
                body: {
                    productType: "game",
                    name: "Game 1",
                    price: 60,
                    inventory_quantity: 100,
                    average_rating: 4.5,
                    category: "Action",
                    description: "Exciting action game",
                    image_urls: ["image1.jpg"],
                    platform: "PC",
                    release_date: "2023-06-01"
                }
            } as any as Request;
            const res: Response = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn()
            } as any as Response;

            const connection: any = {
                beginTransaction: vi.fn(),
                rollback: vi.fn(),
                commit: vi.fn(),
                release: vi.fn()
            };
            (getConnection as any).mockResolvedValue(connection);
            (queryDatabase as any).mockResolvedValue({ affectedRows: 0 });

            await controller.addProduct(req, res);

            expect(connection.beginTransaction).toHaveBeenCalled();
            expect(queryDatabase).toHaveBeenCalled();
            expect(connection.rollback).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Failed to add product." });
        });

        it("should add a game product successfully and return 200", async () => {
            const req: Request = {
                body: {
                    productType: "game",
                    name: "Game 1",
                    price: 60,
                    inventory_quantity: 100,
                    average_rating: 4.5,
                    category: "Action",
                    description: "Exciting action game",
                    image_urls: ["image1.jpg"],
                    platform: "PC",
                    release_date: "2023-06-01"
                }
            } as any as Request;
            const res: Response = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn()
            } as any as Response;

            const connection: any = {
                beginTransaction: vi.fn(),
                rollback: vi.fn(),
                commit: vi.fn(),
                release: vi.fn()
            };
            (getConnection as any).mockResolvedValue(connection);
            (queryDatabase as any).mockResolvedValueOnce({ affectedRows: 1, insertId: 1 });
            (queryDatabase as any).mockResolvedValueOnce({ affectedRows: 1 });

            await controller.addProduct(req, res);

            expect(connection.beginTransaction).toHaveBeenCalled();
            expect(queryDatabase).toHaveBeenCalledTimes(2);
            expect(connection.commit).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Product added successfully." });
            expect(connection.release).toHaveBeenCalled();
        });

        it("should add a merchandise product successfully and return 200", async () => {
            const req: Request = {
                body: {
                    productType: "merchandise",
                    name: "Merch 1",
                    price: 30,
                    inventory_quantity: 50,
                    average_rating: 4,
                    category: "Clothing",
                    description: "Cool merchandise",
                    image_urls: ["image2.jpg"],
                    size: "L",
                    color: "Red",
                    game_id: 1
                }
            } as any as Request;
            const res: Response = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn()
            } as any as Response;

            const connection: any = {
                beginTransaction: vi.fn(),
                rollback: vi.fn(),
                commit: vi.fn(),
                release: vi.fn()
            };
            (getConnection as any).mockResolvedValue(connection);
            (queryDatabase as any).mockResolvedValueOnce({ affectedRows: 1, insertId: 1 });
            (queryDatabase as any).mockResolvedValueOnce({ affectedRows: 1 });
            (queryDatabase as any).mockResolvedValueOnce({ affectedRows: 1 });

            await controller.addProduct(req, res);

            expect(connection.beginTransaction).toHaveBeenCalled();
            expect(queryDatabase).toHaveBeenCalledTimes(3);
            expect(connection.commit).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Product added successfully." });
            expect(connection.release).toHaveBeenCalled();
        });

        it("should return 500 if there is an internal server error", async () => {
            const req: Request = {
                body: {
                    productType: "game",
                    name: "Game 1",
                    price: 60,
                    inventory_quantity: 100,
                    average_rating: 4.5,
                    category: "Action",
                    description: "Exciting action game",
                    image_urls: ["image1.jpg"],
                    platform: "PC",
                    release_date: "2023-06-01"
                }
            } as any as Request;
            const res: Response = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn()
            } as any as Response;

            const connection: any = {
                beginTransaction: vi.fn(),
                rollback: vi.fn(),
                commit: vi.fn(),
                release: vi.fn()
            };
            (getConnection as any).mockResolvedValue(connection);
            (queryDatabase as any).mockRejectedValue(new Error("Database error"));

            await controller.addProduct(req, res);

            expect(connection.beginTransaction).toHaveBeenCalled();
            expect(queryDatabase).toHaveBeenCalled();
            expect(connection.rollback).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Internal server error." });
            expect(connection.release).toHaveBeenCalled();
        });
    });
});