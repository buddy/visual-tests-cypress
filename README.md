# Visual Test Cypress Plugin

A Cypress plugin for performing visual testing using Buddy Works Visual Testing. This plugin allows automatic capturing of website snapshots across different screen resolutions and comparing them with reference versions to detect visual regressions.

## Requirements

- Node.js >= 20
- Cypress >= 14.0.0

## Installation

```bash
npm install -D @buddy-works/visual-tests-cypress
```

## Setup

Add the plugin to your Cypress support file so the custom command is registered:

```js
// cypress/support/e2e.js
import "@buddy-works/visual-tests-cypress";
```

## Basic example

Call the command anywhere in your tests after navigating to a page:

```js
describe("visuals", () => {
  it("homepage snapshot", () => {
    cy.visit("https://buddy.works/blog");
    cy.takeSnap("example-homepage");
  });
});
```

## License

MIT
