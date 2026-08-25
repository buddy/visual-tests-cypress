# Visual Test Cypress Plugin

A Cypress plugin for performing visual testing using Buddy Works Visual Testing. This plugin allows automatic capturing of website snapshots across different screen resolutions and comparing them with reference versions to detect visual regressions.

## Requirements

- **Node.js** `>=20`
- **Cypress** `>=14.0.0`
- **[bdy CLI](https://www.npmjs.com/package/bdy)** — tests must be run through the CLI within a visual testing session, e.g. `bdy tests visual session create "cypress run"`

## Installation

```bash
npm install -D @buddy-works/visual-tests-cypress
```

## Usage

Add the plugin to your Cypress support file so the custom command is registered, then call `cy.takeSnap` anywhere in your tests after navigating to a page.

```javascript
// cypress/support/e2e.js
import "@buddy-works/visual-tests-cypress";
```

```javascript
describe("visuals", () => {
  it("homepage visual test", () => {
    cy.visit("https://example.com");

    cy.takeSnap("homepage", {
      devices: [{ viewport: { width: 1366, height: 768 } }],
      colorScheme: "DARK",
      cloneCookies: true,
    });
  });
});
```

## Examples

Example usage of the plugin can be found in the `examples/` directory:

```bash
# Install dependencies
pnpm i
# Build plugin
pnpm run build
# Go to examples folder
cd examples
# Install examples dependencies
pnpm i
# Add enviroment variables with token
export BUDDY_VT_TOKEN=****
# Run an example
pnpm run test
```

## License

MIT
