import { describe, it, expect } from "vitest";

describe("Admin CRUD API Endpoints", () => {
  const BASE_URL = process.env.TEST_API_URL || "https://vzmorie-five.vercel.app";

  describe("Posts API", () => {
    it("GET /api/admin/posts returns 307 for unauthenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/posts`, {
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });

    it("POST /api/admin/posts returns 307 for unauthenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Test" }),
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });
  });

  describe("Products API", () => {
    it("GET /api/admin/products returns 307 for unauthenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/products`, {
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });

    it("POST /api/admin/products returns 307 for unauthenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Test" }),
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });
  });

  describe("Settings API", () => {
    it("GET /api/admin/settings returns 307 for unauthenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/settings`, {
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });

    it("PUT /api/admin/settings returns 307 for unauthenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "hero", value: {} }),
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });
  });

  describe("Site Images API", () => {
    it("GET /api/admin/site-images returns 307 for unauthenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/site-images`, {
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });

    it("POST /api/admin/site-images returns 307 for unauthenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/site-images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "test", url: "test.jpg" }),
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });
  });

  describe("Upload API", () => {
    it("POST /api/upload returns 401 for unauthenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/upload`, {
        method: "POST",
        redirect: "manual",
      });
      expect(res.status).toBe(401);
    });
  });
});

describe("Public API Endpoints", () => {
  const BASE_URL = process.env.TEST_API_URL || "https://vzmorie-five.vercel.app";

  describe("GET /api/public/posts", () => {
    it("returns published posts", async () => {
      const res = await fetch(`${BASE_URL}/api/public/posts`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe("GET /api/public/hero", () => {
    it("returns hero config", async () => {
      const res = await fetch(`${BASE_URL}/api/public/hero`);
      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/conditions", () => {
    it("returns weather conditions", async () => {
      const res = await fetch(`${BASE_URL}/api/conditions`);
      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/site-images", () => {
    it("returns site images", async () => {
      const res = await fetch(`${BASE_URL}/api/site-images`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });
});
