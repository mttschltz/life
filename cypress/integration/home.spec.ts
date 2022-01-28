describe('Home', () => {
  describe('Updates', () => {
    it('renders', () => {
      cy.visit('')
      cy.contains('systemized.blog').closest('header')
      cy.contains('How to thrive, long-term').closest('header')
      cy.contains('Updates')
    })
  })
})

export {}
