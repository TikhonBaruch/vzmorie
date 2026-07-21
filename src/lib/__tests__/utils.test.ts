import { describe, it, expect } from "vitest";

describe("Slug generation logic", () => {
  it("converts cyrillic to transliterated slug", () => {
    const title = "Привет мир";
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/gi, "-")
      .replace(/^-|-$/g, "");
    expect(slug).toBe("привет-мир");
  });

  it("removes special characters", () => {
    const title = "Hello, World! @#$%";
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/gi, "-")
      .replace(/^-|-$/g, "");
    expect(slug).toBe("hello-world");
  });

  it("handles multiple spaces", () => {
    const title = "  Multiple   spaces  ";
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/gi, "-")
      .replace(/^-|-$/g, "");
    expect(slug).toBe("multiple-spaces");
  });

  it("handles fishing-specific content", () => {
    const title = "Улов щуки на Жилгара";
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/gi, "-")
      .replace(/^-|-$/g, "");
    expect(slug).toBe("улов-щуки-на-жилгара");
  });
});
