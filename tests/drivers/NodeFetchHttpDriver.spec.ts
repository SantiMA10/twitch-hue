import nock from "nock";
import { NodeFetchHttpDriver } from "../../src/drivers/NodeFetchHttpDriver";

describe("NodeFetchHttpDriver", () => {
  describe("#put", () => {
    it("realizes a PUT request to the given URL with the given payload", async () => {
      const scope = nock("https://google.com", {
        reqheaders: {
          "X-My-Awesome-Header": /Awesome/i,
          "Content-Type": "application/json",
        },
      })
        .put("/test", { foo: "bar" })
        .once()
        .reply(200);
      const subject = new NodeFetchHttpDriver();

      await subject.put("https://google.com/test", {
        payload: { foo: "bar" },
        headers: { "X-My-Awesome-Header": "awesome" },
      });

      expect(scope.isDone()).toBeTruthy();
    });

    it("throws an exception if the request return a error", async () => {
      nock("https://google.com")
        .put("/test")
        .once()
        .reply(400, { status: "boom!" });
      const subject = new NodeFetchHttpDriver();

      await expect(subject.put("https://google.com/test", {})).rejects.toThrow(
        new Error('400 - {"status":"boom!"}')
      );
    });
  });

  describe("#post", () => {
    it("realizes a POST request to the given URL with the given payload", async () => {
      const scope = nock("https://google.com", {
        reqheaders: {
          "X-My-Awesome-Header": /Awesome/i,
          "Content-Type": "application/json",
        },
      })
        .post("/test", { foo: "bar" })
        .once()
        .reply(200, { foo: "bar" });
      const subject = new NodeFetchHttpDriver();

      await subject.post("https://google.com/test", {
        payload: { foo: "bar" },
        headers: { "X-My-Awesome-Header": "awesome" },
      });

      expect(scope.isDone()).toBeTruthy();
    });

    it("throws an exception if the request return a error", async () => {
      nock("https://google.com")
        .post("/test")
        .once()
        .reply(400, { status: "boom!" });
      const subject = new NodeFetchHttpDriver();

      await expect(subject.post("https://google.com/test", {})).rejects.toThrow(
        new Error('400 - {"status":"boom!"}')
      );
    });

    it("returns the response from the request", async () => {
      nock("https://google.com")
        .post("/test")
        .once()
        .reply(200, { foo: "bar" });
      const subject = new NodeFetchHttpDriver();

      const response = await subject.post("https://google.com/test", {});

      expect(response).toEqual({ foo: "bar" });
    });

    it("returns an empty response", async () => {
      nock("https://google.com").post("/test").once().reply(200, "");
      const subject = new NodeFetchHttpDriver();

      const response = await subject.post("https://google.com/test", {});

      expect(response).toEqual(undefined);
    });
  });
});
