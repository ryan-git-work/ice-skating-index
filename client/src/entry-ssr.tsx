import React from "react";
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import App from "./App";
import { setSsrMode, clearSsrHeadCapture, getSsrHeadCapture } from "./hooks/use-head";
import { getSkateStatusConsumption, resetSkateStatusConsumption } from "./lib/skateStatusData";

export interface RenderOptions {
  /** Single instant the page is evaluated against. Defaults to the renderer's clock. */
  asOf?: Date;
}

export function render(url: string, options: RenderOptions = {}) {
  setSsrMode(true);
  clearSsrHeadCapture();
  resetSkateStatusConsumption();

  const staticLocationHook = () => [url, () => {}] as [string, (to: string) => void];

  try {
    const html = renderToString(
      <Router hook={staticLocationHook}>
        <App asOf={options.asOf} />
      </Router>
    );

    const head = getSsrHeadCapture();
    // Read before anything else can render: renderToString above is synchronous.
    const usesSkateStatus = getSkateStatusConsumption() > 0;

    return { html, head, usesSkateStatus };
  } finally {
    // A throw must not leave SSR mode latched on or a half-captured head behind
    // for the next request on this long-lived process.
    setSsrMode(false);
    clearSsrHeadCapture();
    resetSkateStatusConsumption();
  }
}
