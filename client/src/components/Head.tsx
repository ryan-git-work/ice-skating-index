import { useEffect } from "react";

interface HeadProps {
  title?: string;
  description?: string;
}

export function Head({ title, description }: HeadProps) {
  useEffect(() => {
    const defaultTitle = "Ice Skating Index";
    const defaultDescription = "Ice Skating Index is the comprehensive directory for ice skating rinks across the US. Find public skating schedules, freestyle sessions, learn-to-skate programs, and hockey rinks in New York, California, Texas, Illinois, and 7 more states.";

    document.title = title ? `${title} | Ice Skating Index` : defaultTitle;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description || defaultDescription);

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
