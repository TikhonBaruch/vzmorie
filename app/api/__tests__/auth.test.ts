import { describe, it, expect } from "vitest";

describe("Auth API", () => {
  const BASE_URL = process.env.TEST_API_URL || "https://vzmorie-five.vercel.app";

  describe("CSRF Token", () => {
    it("returns CSRF token", async () => {
      const res = await fetch(`${BASE_URL}/api/auth/csrf`);
      const data = await res.json();
      expect(data.csrfToken).toBeDefined();
      expect(typeof data.csrfToken).toBe("string");
    });
  });

  describe("Session", () => {
    it("returns empty session when not authenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/auth/session`);
      const data = await res.json();
      expect(data.user).toBeUndefined();
    });
  });

  describe("Credentials Login", () => {
    it("rejects invalid credentials", async () => {
      const csrfRes = await fetch(`${BASE_URL}/api/auth/csrf`);
      const { csrfToken } = await csrfRes.json();

      const res = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=invalid@example.com&password=wrongpassword&csrfToken=${csrfToken}&json=true`,
        redirect: "manual",
      });

      expect(res.status).toBe(200);
    });
  });
});

describe("Role-Based Access Control", () => {
  const BASE_URL = process.env.TEST_API_URL || "https://vzmorie-five.vercel.app";

  const ADMIN_ENDPOINTS = [
    "/api/admin/posts",
    "/api/admin/users",
    "/api/admin/products",
    "/api/admin/settings",
    "/api/admin/site-images",
    "/api/admin/stats",
  ];

  it("returns 307 for unauthenticated requests to admin endpoints", async () => {
    for (const endpoint of ADMIN_ENDPOINTS) {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    }
  });
});
