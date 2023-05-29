// import "jest";
// import supertest from "supertest";
// import mongoose from "mongoose";
// import app from "../server";
// import userService from "../components/databaseFactoryServices";
// import seed from "./seed";
// import utils from "../helpers/utils.helper";
// import nock from "nock";
// import dbConnection from "../config/dbConnection";

// let request: supertest.SuperTest<supertest.Test>;

// beforeAll(async () => {
//   process.env.NODE_ENV = "test";
//   request = supertest(app);
//   const userServiceObj = new userService();
//   const userData = await userServiceObj.addUser(seed.testUser);
//   seed.testUser.userId = userData._id.toString();
// }, 1000);

// afterAll(async () => {
//   await request
//     .delete(`/user/remove/${seed.testUser.userId}`)
//     .set({ authorization: seed.authorizationToken })
//     .expect(200);
// }, 2000);

// describe("Test Public Api", () => {
//   it("Resource Api with 200 response", async () => {
//     await request.get("/resource").expect(200);
//   });

//   it("Resource Api with 500 response", async () => {
//     await request.get("/resource").query({ isError: true }).expect(500);
//   });
// });

// describe("Auth Login Api", () => {
//   it("Login Api with 500 response", async () => {
//     await request
//       .post("/login")
//       .send({
//         email: seed.testUser.email,
//       })
//       .expect(500);
//   });

//   it("Login Api with 400 response", async () => {
//     await request
//       .post("/login")
//       .send({
//         email: seed.testUser.email,
//         password: "Test",
//       })
//       .expect(400);
//   });

//   it("Login Api with 200 response", async () => {
//     await request
//       .post("/login")
//       .send({
//         email: seed.testUser.email,
//         password: seed.testUser.password,
//       })
//       .expect(200)
//       .expect((response) => {
//         expect(response.body.data).toHaveProperty("token");
//         seed.authorizationToken = response.body.data.token;
//       });
//   });
// });

// describe("Create User Api", () => {
//   it("Create User With Missing Param Response", async () => {
//     await request
//       .post("/user")
//       .send({
//         email: "test1@gmail.com",
//         name: "New_Test",
//       })
//       .set({ authorization: seed.authorizationToken })
//       .expect(400);
//   });

//   it("Create User With Auth Token Expired Response", async () => {
//     await request
//       .post("/user")
//       .send({
//         email: "test1@gmail.com",
//         name: "New_Test",
//         password: "TestTest",
//       })
//       .set({ authorization: "" })
//       .expect(401);
//   });

//   it("Create User With 200 Response", async () => {
//     await request
//       .post("/user")
//       .send({
//         email: "test1@gmail.com",
//         name: "New_Test",
//         password: "TestTest",
//       })
//       .set({ authorization: seed.authorizationToken })
//       .expect(200);
//     const UserService = new userService();
//     await UserService.deleteUser("test1@gmail.com", "email");
//   });
// });

// describe("Mock Request Test", () => {
//   it("Spy Function To Over Write Function", async () => {
//     const userResponse = false;
//     expect(utils.tess()).toBeTruthy();
//     jest.spyOn(utils, "tess").mockImplementation(() => userResponse);
//     expect(utils.tess()).toBe(userResponse);
//   });

//   it("Mock Api Call With Nock", async () => {
//     const mockCall = nock("https://www.google.com").get("/").reply(200);
//     await request.get("/mock-test").expect(200);
//     expect(mockCall.isDone()).toBeTruthy();
//   });
// });
