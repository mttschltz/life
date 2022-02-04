declare namespace Cypress {
  interface Chainable {
    /**
     * Get one or more DOM elements by testId suffix. It will prepend the standard prefix.
     *
     * @see — https://on.cypress.io/get
     *
     * @example
     * cy.getTestId('Button--send-email').should('be.visible')
     */
    getTestId: <K extends keyof HTMLElementTagNameMap>(
      testId: string,
      tagName?: keyof HTMLElementTagNameMap,
    ) => Chainable<JQuery<HTMLElementTagNameMap[K]>>
  }
}
