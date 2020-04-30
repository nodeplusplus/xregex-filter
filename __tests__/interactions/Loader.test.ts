import path from "path";

import { Loader } from "../../src/Loader";

describe("Loader", () => {
  const loader = new Loader();
  const filterPath = {
    test: path.resolve(__dirname, "../../mocks/filters"),
    dev: path.resolve(__dirname, "../../src/filters"),
    prod: path.resolve(__dirname, "../../lib/filters"),
  };

  describe("add", () => {
    it("should add directory to loader successfully", () => {
      loader.add(filterPath.prod);
    });
  });

  describe("remove", () => {
    it("should remove directory to loader successfully", () => {
      loader.remove(filterPath.prod);
    });
  });

  describe("run", () => {
    it("should load all filters successful", async () => {
      loader.add(filterPath.test);
      loader.add(filterPath.dev);
      const filters = await loader.run();

      expect(Object.values(filters).length).toBeTruthy();

      // Should includes js
      const testIds = Object.keys(filters).filter((id) =>
        id.startsWith("test")
      );
      expect(testIds.length).toBeTruthy();

      // Should also include ts as weel
      const otherIds = Object.keys(filters).filter(
        (id) => !id.startsWith("test")
      );
      expect(otherIds.length).toBeTruthy();

      // Should not include .d.ts
      // .d.ts produces undefined value
      expect(Object.keys(filters).filter(Boolean).length).toBe(
        Object.values(filters).filter(Boolean).length
      );
    });
  });
});
