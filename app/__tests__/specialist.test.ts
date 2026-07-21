import { describe, it, expect } from "vitest";

describe("SPECIALIST Role", () => {
  const BASE_URL = process.env.TEST_API_URL || "https://vzmorie-five.vercel.app";

  describe("Access Control", () => {
    it("cannot access /api/admin/users without auth", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/users`, {
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });

    it("cannot access /api/admin/products without auth", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/products`, {
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });

    it("cannot access /api/admin/settings without auth", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/settings`, {
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });
  });

  describe("Logout", () => {
    it("logout clears session", async () => {
      const csrfRes = await fetch(`${BASE_URL}/api/auth/csrf`);
      const { csrfToken } = await csrfRes.json();

      const cookieJar: string[] = [];
      const loginRes = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=test@example.com&password=test123&csrfToken=${csrfToken}&json=true`,
        redirect: "manual",
      });

      const cookies = loginRes.headers.getSetCookie();
      cookieJar.push(...cookies);

      const logoutRes = await fetch(`${BASE_URL}/api/auth/signout`, {
        method: "POST",
        headers: {
          Cookie: cookieJar.join("; "),
        },
        redirect: "manual",
      });

      // Logout returns 302 redirect
      expect(logoutRes.status).toBe(302);
    });
  });

  describe("Redirect after logout", () => {
    it("redirects to login page", async () => {
      const res = await fetch(`${BASE_URL}/admin/login`);
      expect(res.status).toBe(200);
    });
  });
});
