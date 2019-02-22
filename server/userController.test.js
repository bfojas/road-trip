const axios = require("axios");

describe("unit tests", () => {

    describe("Create user", () => {
        it("should create a new user", () => {
            axios.post("/auth/register")
        })
    })

    describe("Like trip", () => {
        it("Should like a trip on the server", () => {
            axios.put("/api/like-trip/8")
        })
    })

})

describe("Integration tests", () => {

    describe("Create user", () => {
        it("should create a new user", () => {
            axios.post("/auth/register")
            .then(res => {
                res.data = expect.any(Object)
            })
        })
    })

    describe("Like trip", () => {
        it("Should like a trip on the server", () => {
            axios.put("/api/like-trip/8")
            .then(res => {
                res.data = expect.any(Object)
            })
        })
    })

})