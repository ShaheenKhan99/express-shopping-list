process.env.NODE_ENV = "test";
const request = require('supertest');

const app = require('../app');
let items = require('../fakeDb')

let popsicle = { name: "popsicle", price: 1.40 };


beforeEach(function() {
  items.push(popsicle);
})

afterEach(function() {
  // make sure this mutates, not redefines items
  items.length = 0;
});


describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ items: [popsicle] })
  })
})


describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${popsicle.name}`);
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ item: popsicle })
  })
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get(`/items/icecream`);
    expect(res.statusCode).toBe(404);
  })
})


describe("POST /items", () => {
  test("Creating an item", async () => {
    const res = await request(app).post("/items").send({ name: "crackers", price: 2.50 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: { name: "crackers", price: 2.50 } })
  })
  test("Responds with 400 if name or price is missing", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
  })
})


describe("PATCH  /items/:name", () => {
  test("Updating an item's name or price", async () => {
    const res = await request(app).patch(`/items/${popsicle.name}`).send({ name: "new_popsicle", price: 3.50 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: { name: "new_popsicle", price: 3.50 } })
  })
  test("Responds with 404 for invalid name", async () => {
    const res = await request(app).patch(`/items/Snickers`).send({ name: "candy" });
    expect(res.statusCode).toBe(404);
  })
})

describe("DELETE /items/:name", () => {
  test("Deleting an item", async () => {
    const res = await request(app).delete(`/items/${popsicle.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" })
  })
  test("Responds with 404 for deleting invalid item", async () => {
    const res = await request(app).delete(`/items/popcorn`);
    expect(res.statusCode).toBe(404);
  })
})



