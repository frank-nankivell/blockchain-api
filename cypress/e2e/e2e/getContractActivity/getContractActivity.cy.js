/// <reference types="Cypress" />
const baseUrl = Cypress.env("api_url");
const basePath = "/getContractActivity";
const routePass = Cypress.env("route_password");
const validUser = "89c846fd-f1af-498b-a2cc-8539e2b3a445";

context("getContractActivity.spec", () => {

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
          routePassword: null,
          user_id: "89c846fd-f1af-498b-a2cc-8539e2b3a445"
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
          routePassword: routePass,
          user_id: null
        }
      }
    };
    cy.request(options).then(({ status, body }) => {
      expect(status).to.eq(403);
    });
  });

  it("should successfully get contract activity", () => {
    const options = {
      method: "POST",
      url: `${baseUrl}${basePath}`,
      failOnStatusCode: false,
      headers: {},
      body: {
        data: {
          routePassword: routePass,
          user_id: validUser
        }
      }
    };
    cy.request(options).then(({ status, body }) => {
      expect(status).to.eq(200);
    });
  });

});
