import request from "supertest";
import app from "../../../api/src/index";
import { expect, it, describe } from "vitest";

describe("API endpoints", () => {
    it("return a 200 status", async () => {
        // Arrange
        const res: any = await request(app).get("/");

        // Act / Assert
        expect(res.status).toEqual(200);
    });

    it("return a 400 for an invalid login", async () => {
        // Arrange
        process.env.JWT_SECRET_KEY = "test";
        
        const res: any = await request(app)
            .post("/users/login")
            .send({ email: "xyz@sadfjak.com", password: "2342388" })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json");

        // Act / Assert
        expect(res.status).toEqual(400);
    });

    it("return a 200 for a valid login", async () => {
        // Arrange
        const res: any = await request(app)
            .post("/users/login")
            .send({ email: "test@test.nl", password: "test" })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json");

        // Act / Assert
        expect(res.status).toEqual(200);
    });
});
