describe('Home', () => {
  describe('Updates', () => {
    it('renders', () => {
      cy.visit('')
      cy.contains('systemized.blog').closest('header')
      cy.contains('How to thrive, long-term').closest('header')
      cy.get('main').should('have.length', 1)
      cy.contains('Updates')
    })
  })
})

export {}
