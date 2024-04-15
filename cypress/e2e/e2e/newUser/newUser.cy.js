/// <reference types="Cypress" />
const baseUrl = Cypress.env("api_url");
const basePath = "/newUser";
const routePass = Cypress.env("route_password");
const testTransactionId =
  "testc347e07d47a6d9eb2a2b2fe349d0d40d92280c8c827963b775affc7test";

const createTestUser = () => {
  const validUser = "cypress-user-f1af-498b-a2cc-" + `${Math.random(4)}`;
  return validUser;
};

context("newUser.spec", () => {

  it("should fail without data object", () => {
    const options = {
      method: "POST",
      url: `${baseUrl}${basePath}`,
      failOnStatusCode: false,
      headers: {},
      body: {
        data: null
      }
    };
    cy.request(options).then(({ status, body }) => {
      expect(status).to.eq(400);
    });
  });

  it("should fail without route password", () => {
    const options = {
      method: "POST",
      url: `${baseUrl}${basePath}`,
      failOnStatusCode: false,
      headers: {},
      body: {
        data: {
          user_id: "123",
          routePassword: null
        }
      }
    };
    cy.request(options).then(({ status, body }) => {
      expect(status).to.eq(400);
    });
  });

  it("should fail without a user_id", () => {
    const options = {
      method: "POST",
      url: `${baseUrl}${basePath}`,
      failOnStatusCode: false,
      headers: {},
      body: {
        data: {
          user_id: null,
          routePassword: routePass
        }
      }
    };
    cy.request(options).then(({ status, body }) => {
      expect(status).to.eq(403);
    });
  });

  it("should successfully create newUser", () => {
    const options = {
      method: "POST",
      url: `${baseUrl}${basePath}`,
      failOnStatusCode: false,
      headers: {},
      body: {
        data: {
          user_id: createTestUser(),
          routePassword: routePass
        }
      }
    };
    cy.request(options).then(({ status, body }) => {
      expect(status).to.eq(200);
      const { transaction_id } = body;
      expect(transaction_id).to.equal(testTransactionId);
    });
  });
});
