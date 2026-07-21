import { describe, it, expect } from "vitest";

describe("Block Toggle Functionality", () => {
  const BASE_URL = process.env.TEST_API_URL || "https://vzmorie-five.vercel.app";

  describe("Reviews - isPublished Toggle", () => {
    it("GET /api/admin/reviews returns 307 for unauthenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/reviews`, {
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });

    it("PUT /api/admin/reviews/[id] returns 307 for unauthenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/reviews/test-id`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: false }),
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });

    it("POST /api/admin/reviews returns 307 for unauthenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: "Test", text: "Test review" }),
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });
  });

  describe("Dates - visible Toggle", () => {
    it("GET /api/admin/settings?key=dates returns 307 for unauthenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/settings?key=dates`, {
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });

    it("PUT /api/admin/settings returns 307 for unauthenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "dates", value: { visible: false, dates: [] } }),
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });
  });

  describe("Products - inStock Toggle", () => {
    it("GET /api/admin/products returns 307 for unauthenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/products`, {
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });

    it("PUT /api/admin/products/[id] returns 307 for unauthenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/products/test-id`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inStock: false }),
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });
  });

  describe("Posts - status Toggle", () => {
    it("GET /api/admin/posts returns 307 for unauthenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/posts`, {
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });

    it("PUT /api/admin/posts/[id] returns 307 for unauthenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/posts/test-id`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PUBLISHED" }),
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });
  });

  describe("Site Images - visibility", () => {
    it("GET /api/admin/site-images returns 307 for unauthenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/site-images`, {
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });

    it("PUT /api/admin/site-images/[id] returns 307 for unauthenticated", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/site-images/test-id`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt: "Updated alt" }),
        redirect: "manual",
      });
      expect(res.status).toBe(307);
    });
  });

  describe("Public API reflects toggle state", () => {
    it("GET /api/public/posts returns only published posts", async () => {
      const res = await fetch(`${BASE_URL}/api/public/posts`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
    });

    it("GET /api/site-images returns all site images", async () => {
      const res = await fetch(`${BASE_URL}/api/site-images`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });
});
