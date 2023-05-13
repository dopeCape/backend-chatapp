import request from "supertest";
import { app } from "../src/index.ts";
let server = app.listen(9000);
describe("a test test", () => {
  it("its a test test", async () => {
    await request(app).get("/test").expect(200);
  });

  jest.setTimeout(2000);
  afterAll(() => {
    server.close();
  });
});
