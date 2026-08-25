import type { ParseDomResult, Snapshot, SnapshotOptions } from "./types";

interface SnapshotGlobal {
  SNAPSHOT?: {
    parseDom: (document: Document, jsEnabled?: boolean) => ParseDomResult;
  };
}

/**
 * Context collected from the Cypress chain before building a snapshot
 */
interface CaptureContext {
  cookies: Cypress.Cookie[];
  dom: Document;
  name: string;
  options: SnapshotOptions;
  url: string;
}

/**
 * Plugin for capturing snapshots of web pages for visual testing.
 */
class VisualTestsPlugin {
  /**
   * Fetches and evaluates the parseDom script unless it is already present
   * @private
   * @returns {Promise<void>}
   */
  private async loadParseDom(): Promise<void> {
    if (snapshotGlobal.SNAPSHOT) {
      return;
    }

    const response = await fetch("http://localhost:1337/parseDom.js", {
      cache: "no-cache",
      credentials: "same-origin",
      method: "GET",
      mode: "cors",
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });

    // Indirect eval so the script runs in the global scope regardless of the preprocessor
    // oxlint-disable-next-line no-eval
    globalThis.eval(await response.text());
  }

  /**
   * Returns the page cookies when cloning is requested
   * @private
   * @param {Cypress.Cookie[]} cookies - The cookies read from the Cypress chain
   * @param {boolean} [cloneCookies] - Whether cookies should be cloned
   * @returns {Cypress.Cookie[]} The page cookies, or an empty array
   */
  private collectCookies(cookies: Cypress.Cookie[], cloneCookies?: boolean): Cypress.Cookie[] {
    if (cloneCookies) {
      return cookies;
    }
    return [];
  }

  /**
   * Builds the snapshot payload from the current page state
   * @private
   * @param {CaptureContext} context - The capture context
   * @returns {Snapshot} The snapshot data
   * @throws {Error} When the parseDom script is not available
   */
  private buildSnapshot({ cookies, dom, name, options, url }: CaptureContext): Snapshot {
    if (!snapshotGlobal.SNAPSHOT) {
      throw new Error("Failed to load the parseDom script");
    }

    const { html, resources, title } = snapshotGlobal.SNAPSHOT.parseDom(
      dom,
      options.enableJavaScript,
    );

    return {
      colorScheme: options.colorScheme,
      cookies: this.collectCookies(cookies, options.cloneCookies),
      cssIgnores: options.cssIgnores,
      devices: options.devices,
      enableJavaScript: options.enableJavaScript,
      fullPage: options.fullPage,
      html,
      injectStyles: options.injectStyles,
      name,
      resourceDiscoveryTimeout: options.resourceDiscoveryTimeout,
      resources,
      title,
      url,
      version: 1,
      xpathIgnores: options.xpathIgnores,
    };
  }

  /**
   * Sends the snapshot to the server
   * @private
   * @param {Snapshot} snapshot - The snapshot data
   * @returns {Promise<void>}
   */
  private async sendSnapshot(snapshot: Snapshot): Promise<void> {
    await fetch("http://localhost:1337/snapshot", {
      body: JSON.stringify(snapshot),
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      mode: "cors",
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
  }

  /**
   * Logs the taken snapshot to the Cypress command log
   * @private
   * @param {string} name - The name of the snapshot
   * @param {SnapshotOptions} options - The snapshot options
   * @returns {void}
   */
  private logSnapshot(name: string, options: SnapshotOptions): void {
    Cypress.log({
      consoleProps() {
        return {
          colorScheme: options.colorScheme,
          cssIgnores: options.cssIgnores,
          devices: options.devices,
          enableJavaScript: options.enableJavaScript,
          fullPage: options.fullPage,
          injectStyles: options.injectStyles,
          name,
          resourceDiscoveryTimeout: options.resourceDiscoveryTimeout,
          xpathIgnores: options.xpathIgnores,
        };
      },
      displayName: "snapshot",
      message: name,
      name: "takeSnap",
    });
  }

  /**
   * Takes a snapshot of the current page
   * @param {CaptureContext} context - The capture context
   * @returns {Promise<void>}
   * @throws {Error} When parseDom.js fails to load
   */
  async takeSnap(context: CaptureContext): Promise<void> {
    await this.loadParseDom();
    const snapshot = this.buildSnapshot(context);

    try {
      await this.sendSnapshot(snapshot);
      this.logSnapshot(context.name, context.options);
    } catch (error) {
      console.error(`Taking snapshot ${context.name} failed`);
      console.error(error);
    }
  }
}

const snapshotGlobal = globalThis as typeof globalThis & SnapshotGlobal,
  visualTestsPlugin = new VisualTestsPlugin();

Cypress.Commands.add("takeSnap", (name: string, options: SnapshotOptions = {}) => {
  Cypress.log({ name: `Take Snapshot: ${name}` });

  return cy
    .getCookies()
    .then((cookies) =>
      cy
        .document({ log: false })
        .then((dom) =>
          cy.url().then((url) => visualTestsPlugin.takeSnap({ cookies, dom, name, options, url })),
        ),
    );
});
