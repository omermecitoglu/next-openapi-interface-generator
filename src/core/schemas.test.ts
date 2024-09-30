import { describe, expect, it, jest } from "@jest/globals";
import findPredefinedSchemas from "./schemas";

jest.mock("fs/promises");

describe("findPredefinedSchemas", () => {
  it("should ...", () => {
    expect(findPredefinedSchemas).not.toBeNull();
  });
});
