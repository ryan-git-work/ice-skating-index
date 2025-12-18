import { useEffect } from "react";

interface HeadProps {
  title?: string;
  description?: string;
}

export function Head({ title, description }: HeadProps) {
  useEffect(() => {
    const defaultTitle = "Ice Skating Index";
    const defaultDescription = "The definitive directory for ice skating rinks, schedules, and freestyle sessions.";

    document.title = title ? `${title} | Ice Skating Index` : defaultTitle;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description || defaultDescription);

    // Update OG tags as well for completeness (though client-side only)
    const updateMeta = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateMeta('og:title', title ? `${title} | Ice Skating Index` : defaultTitle);
    updateMeta('og:description', description || defaultDescription);

  }, [title, description]);

  return null;
}
