import { describe, expect, it, jest } from "@jest/globals";
import getArgument from "./arguments";

jest.mock("fs/promises");

describe("getArgument", () => {
  it("should ...", () => {
    expect(getArgument).not.toBeNull();
  });
});
