import { jest } from "@jest/globals";

jest.unstable_mockModule("pg", () => ({
  mockQuery: jest.fn(),
  Pool: class {
    query(sql, params) {
      return jest.fn()(sql, params);
    }
  }
}));

const { mockQuery } = await import("pg");
const { POST: CreateLink, GET: ListLinks } = await import("@/app/api/links/route");
const { GET: GetOneLink, DELETE: DeleteLink } = await import("@/app/api/links/[code]/route");
const { GET: Health } = await import("@/app/healthz/route");

describe("TinyLink API Tests", () => {
  test("GET /healthz returns ok", async () => {
    const res = await Health();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
  });
});
