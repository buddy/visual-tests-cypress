/// <reference types="cypress" />

interface IDevice {
  viewport: {
    width: number;
    height: number;
  };
  screen?: {
    width: number;
    height: number;
  };
  devicePixelRatio?: number;
  isMobile?: boolean;
}

type ColorScheme = "LIGHT" | "DARK" | "LIGHT_AND_DARK";

interface ISnapshotOptions {
  devices?: IDevice[];
  fullPage?: boolean;
  colorScheme?: ColorScheme;
  enableJavaScript?: boolean;
  injectStyles?: string;
  resourceDiscoveryTimeout?: number;
  cloneCookies?: boolean;
  cssIgnores?: string[];
  xpathIgnores?: string[];
}

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      takeSnapshot(
        name: string,
        options?: ISnapshotOptions,
      ): Chainable<Subject>;
    }
  }
}
export {};
