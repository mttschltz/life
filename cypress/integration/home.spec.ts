describe('Home', () => {
  describe('Page', () => {
    it('renders', () => {
      cy.visit('')

      // Header
      cy.contains('systemized.blog').closest('header')
      cy.contains('How to thrive, long-term').closest('header')
      cy.get('main').should('have.length', 1)

      // Tabs
      cy.get('nav').should('contain.text', 'Plan')
      cy.get('nav')
        .should('have.length', 1)
        .find('button')
        .should(($buttons) => {
          expect($buttons).to.have.length(2)
          expect($buttons.eq(0)).to.contain('Plan')
          expect($buttons.eq(1)).to.contain('Action')
        })

      // Updates
      cy.contains('Updates')
    })
  })
})

export {}
