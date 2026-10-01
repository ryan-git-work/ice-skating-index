import { useEffect } from 'react';
import { SSR_SCHEMA_ATTRIBUTE } from '@shared/pageHtml';

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalPath?: string;
  robots?: string;
  structuredData?: object[];
}

const DEFAULT_DESCRIPTION = "Ice Skating Index is the comprehensive directory for ice skating rinks across the US. Find public skating schedules, freestyle sessions, learn-to-skate programs, and hockey rinks in New York, California, Texas, Illinois, and 7 more states.";

// SSR capture
let ssrHeadCapture: HeadProps | null = null;
let isSsrMode = false;

export function setSsrMode(value: boolean) {
  isSsrMode = value;
}

export function getSsrHeadCapture(): HeadProps | null {
  return ssrHeadCapture;
}

export function clearSsrHeadCapture() {
  ssrHeadCapture = null;
}

/** Marks the ld+json this hook owns, so it replaces its own scripts instead of stacking them. */
const CLIENT_SCHEMA_ATTRIBUTE = "data-head-schema";

/**
 * Schema this application emits, from either side of the render.
 *
 * Ownership is explicit on purpose: the hook replaces only the blocks the
 * prerenderer, the runtime renderer, or a previous pass of this hook put in the
 * head, and leaves anything else there alone.
 */
const OWNED_SCHEMA_SELECTOR =
  `script[type="application/ld+json"][${SSR_SCHEMA_ATTRIBUTE}],` +
  `script[type="application/ld+json"][${CLIENT_SCHEMA_ATTRIBUTE}]`;

/**
 * Replaces the application's ld+json blocks with the current page's schema.
 *
 * Server-rendered schema is a snapshot of the instant the HTML was produced. A
 * tab left open past a status expiry, or a client-side navigation, has to drop
 * those blocks or the page keeps publishing a claim the visible page no longer
 * makes. Removing the owned set before appending is what keeps the count at one
 * copy per schema instead of two.
 */
function syncStructuredData(structuredData: object[] | undefined) {
  const head = document.head;
  head.querySelectorAll(OWNED_SCHEMA_SELECTOR).forEach((node) => node.remove());

  if (!structuredData?.length) return;

  for (const data of structuredData) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute(CLIENT_SCHEMA_ATTRIBUTE, "");
    script.textContent = JSON.stringify(data).replace(/</g, "\\u003c");
    head.appendChild(script);
  }
}

export function useHead({ title, description, image, ogTitle, ogDescription, canonicalPath, robots, structuredData }: HeadProps) {
  // Capture for SSR during render phase
  if (isSsrMode) {
    const fullTitle = title
      ? (title.endsWith(' | Ice Skating Index') ? title : `${title} | Ice Skating Index`)
      : 'Ice Skating Index';
    ssrHeadCapture = {
      ...(ssrHeadCapture || {}),
      ...(title !== undefined && { title: fullTitle }),
      ...(description !== undefined && { description }),
      ...(image !== undefined && { image }),
      ...(ogTitle !== undefined && { ogTitle }),
      ...(ogDescription !== undefined && { ogDescription }),
      ...(canonicalPath !== undefined && { canonicalPath }),
      ...(robots !== undefined && { robots }),
      ...(structuredData !== undefined && { structuredData }),
    };
  }

  // Serialized so re-renders with an equivalent schema array do not churn the DOM.
  const structuredDataKey = structuredData?.length ? JSON.stringify(structuredData) : "";

  useEffect(() => {
    if (title) {
      document.title = `${title} | Ice Skating Index`;
    } else {
      document.title = 'Ice Skating Index';
    }

    const descriptionContent = description || DEFAULT_DESCRIPTION;
    const ogTitleContent = ogTitle || (title ? `${title} | Ice Skating Index` : 'Ice Skating Index');
    const ogDescContent = ogDescription || descriptionContent;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptionContent);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = descriptionContent;
      document.head.appendChild(meta);
    }

    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) {
      ogTitleTag.setAttribute('content', ogTitleContent);
    }

    const ogDescriptionTag = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionTag) {
      ogDescriptionTag.setAttribute('content', ogDescContent);
    }

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', ogTitleContent);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', ogDescContent);
    }

    if (image) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute('content', image);
      }
      const twitterImage = document.querySelector('meta[name="twitter:image"]');
      if (twitterImage) {
        twitterImage.setAttribute('content', image);
      }
    }

    const canonicalHref = canonicalPath
      ? `https://iceskatingindex.com${canonicalPath === "/" ? "/" : canonicalPath}`
      : null;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonicalHref) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", canonicalHref);
    }

    if (robots) {
      let robotsTag = document.querySelector('meta[name="robots"]');
      if (!robotsTag) {
        robotsTag = document.createElement("meta");
        robotsTag.setAttribute("name", "robots");
        document.head.appendChild(robotsTag);
      }
      robotsTag.setAttribute("content", robots);
    }

    syncStructuredData(structuredData);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- structuredDataKey stands in for the array
  }, [title, description, image, ogTitle, ogDescription, canonicalPath, robots, structuredDataKey]);
}
