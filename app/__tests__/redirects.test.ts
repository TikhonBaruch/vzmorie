import { describe, it, expect } from "vitest";

describe("Admin Page Redirects", () => {
  const BASE_URL = process.env.TEST_API_URL || "https://vzmorie-five.vercel.app";

  const adminPages = [
    "/admin",
    "/admin/chat",
    "/admin/posts",
    "/admin/hero",
    "/admin/tariffs",
    "/admin/dates",
    "/admin/conditions",
    "/admin/products",
    "/admin/images",
    "/admin/users",
  ];

  it.each(adminPages)("redirects unauthenticated user from %s to login", async (page) => {
    const res = await fetch(`${BASE_URL}${page}`, {
      redirect: "manual",
    });
    expect(res.status).toBe(307);
  });

  it("login page is accessible without auth", async () => {
    const res = await fetch(`${BASE_URL}/admin/login`);
    expect(res.status).toBe(200);
  });
});

describe("Public Pages Accessible", () => {
  const BASE_URL = process.env.TEST_API_URL || "https://vzmorie-five.vercel.app";

  const publicPages = [
    "/",
    "/posts",
  ];

  it.each(publicPages)("allows access to %s without auth", async (page) => {
    const res = await fetch(`${BASE_URL}${page}`, {
      redirect: "manual",
    });
    expect(res.status).toBe(200);
  });
});
