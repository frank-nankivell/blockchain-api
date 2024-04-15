/// <reference types="Cypress" />
const baseUrl = Cypress.env("api_url");
const basePath = "/transferToken";
const routePass = Cypress.env("route_password");
const testTransactionId =
  "testc347e07d47a6d9eb2a2b2fe349d0d40d92280c8c827963b775affc7test";
const validUser = "89c846fd-f1af-498b-a2cc-8539e2b3a445";

context("getCurrencyBalance.spec", () => {
    
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
          sender: "test",
          receiver: validUser,
          amount: 1,
          survey_hash: "NGO_TOP_UP",
          routePassword: null
        }
      }
    };
    cy.request(options).then(({ status, body }) => {
      expect(status).to.eq(400);
    });
  });

  it("should fail without a sender", () => {
    const options = {
      method: "POST",
      url: `${baseUrl}${basePath}`,
      failOnStatusCode: false,
      headers: {},
      body: {
        data: {
          sender: null,
          receiver: validUser,
          amount: 1,
          survey_hash: "NGO_TOP_UP",
          routePassword: routePass
        }
      }
    };
    cy.request(options).then(({ status, body }) => {
      expect(status).to.eq(404);
    });
  });
  it("should fail without a reciever", () => {
    const options = {
      method: "POST",
      url: `${baseUrl}${basePath}`,
      failOnStatusCode: false,
      headers: {},
      body: {
        data: {
          sender: "test",
          receiver: null,
          amount: 1,
          survey_hash: "NGO_TOP_UP",
          routePassword: routePass
        }
      }
    };
    cy.request(options).then(({ status, body }) => {
      expect(status).to.eq(404);
    });
  });

  it("should fail without an amount", () => {
    const options = {
      method: "POST",
      url: `${baseUrl}${basePath}`,
      failOnStatusCode: false,
      headers: {},
      body: {
        data: {
          sender: "test",
          receiver: validUser,
          amount: null,
          survey_hash: "NGO_TOP_UP",
          routePassword: routePass
        }
      }
    };
    cy.request(options).then(({ status, body }) => {
      expect(status).to.eq(404);
    });
  });
  it("should fail without an survey_hash", () => {
    const options = {
      method: "POST",
      url: `${baseUrl}${basePath}`,
      failOnStatusCode: false,
      headers: {},
      body: {
        data: {
          sender: "test",
          receiver: validUser,
          amount: 1,
          survey_hash: null,
          routePassword: routePass
        }
      }
    };
    cy.request(options).then(({ status, body }) => {
      expect(status).to.eq(404);
    });
  });

  it("should successfully transfer Tokens", () => {
    const options = {
      method: "POST",
      url: `${baseUrl}${basePath}`,
      failOnStatusCode: false,
      headers: {},
      body: {
        data: {
          sender: "test",
          receiver: validUser,
          amount: 1,
          survey_hash: "NGO_TOP_UP",
          routePassword: routePass
        }
      }
    };
    cy.request(options).then(({ status, body }) => {
      expect(status).to.eq(200);
      const { data } = body;
      const { transaction_id } = data;
      expect(transaction_id).to.equal(testTransactionId);
    });
  });
});
