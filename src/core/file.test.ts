import { describe, expect, it, jest } from "@jest/globals";
import createFile from "./file";

jest.mock("fs/promises");

describe("createFile", () => {
  it("should ...", () => {
    expect(createFile).not.toBeNull();
  });
});
