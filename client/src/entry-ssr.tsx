import React from "react";
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import App from "./App";
import { setSsrMode, clearSsrHeadCapture, getSsrHeadCapture } from "./hooks/use-head";

export function render(url: string) {
  setSsrMode(true);
  clearSsrHeadCapture();

  const staticLocationHook = () => [url, () => {}] as [string, (to: string) => void];

  const html = renderToString(
    <Router hook={staticLocationHook}>
      <App />
    </Router>
  );

  const head = getSsrHeadCapture();
  setSsrMode(false);

  return { html, head };
}
