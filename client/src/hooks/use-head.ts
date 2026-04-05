import { useEffect } from 'react';

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
}

const DEFAULT_DESCRIPTION = "Ice Skating Index is the comprehensive directory for ice skating rinks across the US. Find public skating schedules, freestyle sessions, learn-to-skate programs, and hockey rinks in New York, California, Texas, Illinois, and 7 more states.";

export function useHead({ title, description, image }: HeadProps) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Ice Skating Index`;
    } else {
      document.title = 'Ice Skating Index';
    }

    const descriptionContent = description || DEFAULT_DESCRIPTION;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptionContent);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = descriptionContent;
      document.head.appendChild(meta);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', descriptionContent);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', descriptionContent);
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
  }, [title, description, image]);
}
