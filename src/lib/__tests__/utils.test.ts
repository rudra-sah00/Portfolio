import { cn } from "../utils";

describe("Utils", () => {
  describe("cn (className utility)", () => {
    it("should merge class names correctly", () => {
      const result = cn("text-red-500", "bg-blue-500");
      expect(result).toBe("text-red-500 bg-blue-500");
    });

    it("should handle conditional classes", () => {
      const isActive = true;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toBe("base-class active-class");
    });

    it("should merge tailwind classes correctly", () => {
      const result = cn("px-2 py-1", "px-4");
      expect(result).toBe("py-1 px-4");
    });

    it("should handle undefined and null values", () => {
      const result = cn("text-red-500", undefined, null, "bg-blue-500");
      expect(result).toBe("text-red-500 bg-blue-500");
    });

    it("should handle array of classes", () => {
      const result = cn(["text-red-500", "bg-blue-500"]);
      expect(result).toBe("text-red-500 bg-blue-500");
    });

    it("should handle object notation", () => {
      const result = cn({
        "text-red-500": true,
        "bg-blue-500": false,
        "font-bold": true,
      });
      expect(result).toBe("text-red-500 font-bold");
    });

    it("should return empty string for no arguments", () => {
      const result = cn();
      expect(result).toBe("");
    });
  });
});
