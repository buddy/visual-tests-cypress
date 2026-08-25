describe("Homepage", () => {
  it("takes a snapshot", () => {
    cy.visit("https://buddy.works/");
    cy.takeSnap("buddy-blog");
  });
});
