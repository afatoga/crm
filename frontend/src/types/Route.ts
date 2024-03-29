import React, { ComponentType, FC } from "react";

/**
 * Represents the route of a page.
 */
export type Route = {
  /**
   * The key of the route
   * @type {string}
   * @memberof Route
   * @required
   * @example
   * "dashboard"
   */
  key: string;

  /**
   * The titleCode of the route (i18next module)
   * @type {string}
   * @memberof Route
   * @required
   * @example
   * "pageTitles.account-settings"
   */
  titleCode: string;

  /**
   * The description of the route
   * @type {string}
   * @memberof Route
   * @required
   * @example
   * "Go to My Dashboard Page"
   */
  description?: string;

  /**
   * The path of the route
   * @type {string}
   * @memberof Route
   * @required
   * @example
   * "/dashboard"
   */
  path: string;

  /**
   * The component referenced by the route
   * @type {FC}
   * @memberof Route
   * @required
   * @example
   * "<Dashboard />"
   */
  component?: React.ComponentType;

  /**
   * For administrators
   *
   *
   * @type {boolean}
   * @memberof Route
   * @required
   * @example
   * true
   * @default
   * false
   */
  isAdmin?: boolean;

  /**
   * For logged-in users only
   *
   *
   * @type {boolean}
   * @memberof Route
   * @required
   * @example
   * true
   * @default
   * true
   */
  isProtected?: boolean;

  /**
   * The status of the route
   * @type {boolean}
   * @memberof Route
   * @required
   * @example
   * true
   * @default
   * true
   */
  isEnabled: boolean;

  /**
   * The icon that illustrates the route
   * @type {string}
   * @memberof Route
   * @optional
   * @example
   * DashboardIcon
   */
  icon?: ComponentType;

  /**
   * The array of sub routes
   * @type {Route[]}
   * @memberof Route
   * @optional
   * @example
   * "[{} as Route, ...]"
   */
  subRoutes?: Route[];

  /**
   * The divider indicator for the route
   * @type {boolean}
   * @memberof Route
   * @optional
   * @example
   * true
   * @default
   * false
   */
  appendDivider?: boolean;

  /**
   * Indicate of menu item is expanded
   * @type {boolean}
   * @memberof Route
   * @optional
   * @example
   * true
   * @default
   * false
   */
  expanded?: boolean;
};
