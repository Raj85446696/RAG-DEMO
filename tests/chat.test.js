import request from "supertest";
import { jest } from "@jest/globals";

// 🔹 ESM-compatible mock
await jest.unstable_mockModule("../middlewares/responsechat.middleware.js",
  () => ({
    responseChat: (req, res) => {
      return res.status(200).json({
        success: true,
        reply: "Mocked chatbot response"
      });
    }
  })
);

// 🔹 Import app AFTER mocking
const { default: app } = await import("../src/app.js");

describe("POST /chat API", () => {

  test("should return chatbot response when valid request is sent", async () => {
    const response = await request(app)
      .post("/chat")
      .send({ question: "What is UMANG?" });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.reply).toBe("Mocked chatbot response");
  });

  test("should accept JSON content type", async () => {
    const response = await request(app)
      .post("/chat")
      .set("Content-Type", "application/json")
      .send({ question: "Hello" });

    expect(response.headers["content-type"]).toMatch(/json/);
  });

});
