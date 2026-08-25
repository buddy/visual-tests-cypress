/// <reference types="cypress" preserve="true" />

/**
 * Interface representing viewport dimensions
 */
export interface Viewport {
  /**
   * The width of the viewport
   */
  width: number;

  /**
   * The height of the viewport
   */
  height: number;
}

/**
 * Interface representing a device configuration
 */
export interface Device {
  /**
   * The viewport settings
   */
  viewport: Viewport;

  /**
   * The screen settings
   */
  screen?: Viewport;

  /**
   * The device pixel ratio
   */
  devicePixelRatio?: number;

  /**
   * Whether the device is mobile
   */
  isMobile?: boolean;
}

/**
 * The color scheme variants used when creating screenshots
 */
export type ColorScheme = "LIGHT" | "DARK" | "LIGHT_AND_DARK";

/**
 * Interface for snapshot options
 */
export interface SnapshotOptions {
  /**
   * Array of custom device configurations
   */
  devices?: Device[];

  /**
   * Whether to screenshot the full page
   */
  fullPage?: boolean;

  /**
   * The color scheme variants used when creating screenshots
   */
  colorScheme?: ColorScheme;

  /**
   * Whether to enable JavaScript when creating screenshots
   */
  enableJavaScript?: boolean;

  /**
   * Custom CSS styles to inject when creating screenshots
   */
  injectStyles?: string;

  /**
   * Timeout for resource discovery
   */
  resourceDiscoveryTimeout?: number;

  /**
   * Whether to clone cookies
   */
  cloneCookies?: boolean;

  /**
   * CSS selectors of elements ignored during comparison
   */
  cssIgnores?: string[];

  /**
   * XPath selectors of elements ignored during comparison
   */
  xpathIgnores?: string[];
}

/**
 * Interface representing the result of parsing the DOM
 */
export interface ParseDomResult {
  /**
   * The title of the page
   */
  title: string;

  /**
   * The HTML content
   */
  html: string;

  /**
   * The page resources
   */
  resources: Record<string, unknown>[];
}

/**
 * Interface representing a snapshot
 */
export interface Snapshot {
  /**
   * The name of the snapshot
   */
  name: string;

  /**
   * The URL of the page
   */
  url: string;

  /**
   * The title of the page
   */
  title: string;

  /**
   * The HTML content
   */
  html: string;

  /**
   * The page resources
   */
  resources: Record<string, unknown>[];

  /**
   * Array of device configurations
   */
  devices?: Device[];

  /**
   * The color scheme used
   */
  colorScheme?: ColorScheme;

  /**
   * Resource discovery timeout used
   */
  resourceDiscoveryTimeout?: number;

  /**
   * Whether full page was captured
   */
  fullPage?: boolean;

  /**
   * Whether JavaScript was enabled
   */
  enableJavaScript?: boolean;

  /**
   * Custom CSS styles injected
   */
  injectStyles?: string;

  /**
   * Cloned cookies
   */
  cookies: Cypress.Cookie[];

  /**
   * CSS selectors ignored
   */
  cssIgnores?: string[];

  /**
   * XPath expressions ignored
   */
  xpathIgnores?: string[];

  /**
   * The snapshot version
   */
  version: number;
}

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Takes a snapshot of the current page for visual testing
       * @param name - The name of the snapshot
       * @param options - The snapshot options
       */
      takeSnap: (name: string, options?: SnapshotOptions) => Chainable<Subject>;
    }
  }
}
