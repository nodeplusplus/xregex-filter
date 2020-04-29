import path from "path";

import { Loader } from "../../src/Loader";

describe("Loader", () => {
  const loader = new Loader();
  const filterPath = {
    test: path.resolve(__dirname, "../../mocks/filters"),
    prod: path.resolve(__dirname, "../../lib/filters"),
  };

  describe("add", () => {
    it("should add directory to loader successfully", () => {
      loader.add(filterPath.prod);
      loader.add(filterPath.test);
    });
  });

  describe("remove", () => {
    it("should remove directory to loader successfully", () => {
      loader.remove(filterPath.prod);
    });
  });

  describe("run", () => {
    it("should load all filters successful", async () => {
      const filters = await loader.run();

      expect(Object.values(filters).length).toBeTruthy();

      const testIds = Object.keys(filters).filter((id) =>
        id.startsWith("test")
      );
      expect(testIds.length).toBeTruthy();
    });
  });
});
