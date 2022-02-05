const sizes = ['iphone-x' as const, [1280, 800]]

describe('index', () => {
  sizes.forEach((size) => {
    describe(`On screen size: ${typeof size === 'string' ? size : JSON.stringify(size)}`, () => {
      beforeEach(() => {
        if (Cypress._.isArray(size)) {
          cy.viewport(size[0], size[1])
        } else {
          cy.viewport(size)
        }
      })
      it('Renders data and semantic markup', () => {
        cy.visit('')

        // Header and semantic markup
        cy.get('h1')
          .should('have.length', 1)
          .should('have.text', 'systemized.blog')
          .siblings()
          .should('have.length', 2)
          .contains('How to thrive, long-term')
          .closest('header')

        // Tabs and semantic markup
        cy.getTestId('Tab--layout--nav--tab--plan').should('have.text', 'Plan').closest('nav')
        cy.getTestId('Tab--layout--nav--tab--action').should('have.text', 'Action').closest('nav')

        // Body semantic markup
        cy.get('main').should('have.length', 1)

        // Categories data
        cy.getTestId('Button--index--category-nav--1', 'a')
          .should('have.text', 'Health')
          .should('have.attr', 'href')
          .should('equal', '/health')
        cy.getTestId('Button--index--category-nav--4', 'a')
          .should('have.text', 'Illnesses')
          .should('have.attr', 'href')
          .should('equal', '/illnesses')
        cy.getTestId('Button--index--category-nav--5', 'a')
          .should('have.text', 'Quality of Life')
          .should('have.attr', 'href')
          .should('equal', '/quality-of-life')
        cy.getTestId('Button--index--category-nav--6', 'a')
          .should('have.text', 'Aesthetics')
          .should('have.attr', 'href')
          .should('equal', '/aesthetics')

        cy.getTestId('Button--index--category-nav--2', 'a')
          .should('have.text', 'Wealth')
          .should('have.attr', 'href')
          .should('equal', '/wealth')
        cy.getTestId('Button--index--category-nav--7', 'a')
          .should('have.text', 'Retirement')
          .should('have.attr', 'href')
          .should('equal', '/retirement')
        cy.getTestId('Button--index--category-nav--8', 'a')
          .should('have.text', 'Financial Goals')
          .should('have.attr', 'href')
          .should('equal', '/financial-goals')

        cy.getTestId('Button--index--category-nav--3', 'a')
          .should('have.text', 'Security')
          .should('have.attr', 'href')
          .should('equal', '/security')
        cy.getTestId('Button--index--category-nav--9', 'a')
          .should('have.text', 'Security at Home')
          .should('have.attr', 'href')
          .should('equal', '/security-at-home')
        cy.getTestId('Button--index--category-nav--10', 'a')
          .should('have.text', 'Security When Out')
          .should('have.attr', 'href')
          .should('equal', '/security-when-out')
        cy.getTestId('Button--index--category-nav--11', 'a')
          .should('have.text', 'Digital Security')
          .should('have.attr', 'href')
          .should('equal', '/digital-security')

        // Categories semantic markup
        cy.getTestId('Box--index--category-nav', 'nav')
        cy.getTestId('Button--index--category-nav--1', 'a').find('h2').should('have.text', 'Health')
        cy.getTestId('Button--index--category-nav--4', 'a').find('h3').should('have.text', 'Illnesses')

        // Updates data
        cy.getTestId('Box--index--updates', 'section')
          .find('article')
          .first()
          .as('updates-first')
          .find('a')
          .should('have.text', 'Digital Security')
          .get('@updates-first')
          .contains('Jan 31, 2022')
          .get('@updates-first')
          .contains('Being secure online, with devices, and personal information.')
        cy.getTestId('Box--index--updates', 'section')
          .find('article')
          .last()
          .as('updates-last')
          .find('a')
          .should('have.text', 'Wealth')
          .get('@updates-last')
          .contains('Jan 18, 2022')
          .get('@updates-last')
          .contains('Building and maintaining a strong and ongoing financial foundation.')

        // Updates semantic markup
        cy.getTestId('Box--index--updates', 'section').find('h2').should('have.text', 'Updates')
        cy.getTestId('Box--index--updates', 'section')
          .find('article')
          // The updates graph query is capped to 10 results
          .should('have.length', 10)
          .find('a')
          .should('have.length', 10)
          .find('h3')
          .should('have.length', 10)
      })
      specify('Category items are navigable and not overlayed by Diagrams', () => {
        cy.visit('')

        // Guard until SVG from Diagram is rendered because the links we want to click will be
        // removed and re-mounted, which can cause a race condition.
        cy.getTestId('Box--index--category-nav').find('svg > g > path').should('have.length.at.least', 1)

        cy.getTestId('Button--index--category-nav--1', 'a')
          .click()
          .location('pathname')
          .should('equal', '/health')
          .go('back')
        cy.getTestId('Button--index--category-nav--4', 'a')
          .click()
          .location('pathname')
          .should('equal', '/illnesses')
          .go('back')
      })
      specify('Update items are navigable', () => {
        cy.visit('')

        cy.getTestId('GatsbyLink--index--updates--update-link--11')
          .click()
          .location('pathname')
          .should('equal', '/digital-security')
          .go('back')

        cy.getTestId('GatsbyLink--index--updates--update-link--2')
          .click()
          .location('pathname')
          .should('equal', '/wealth')
          .go('back')
      })
    })
  })
})

export {}
