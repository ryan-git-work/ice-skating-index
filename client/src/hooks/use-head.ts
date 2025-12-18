import { useEffect } from 'react';

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
}

export function useHead({ title, description, image }: HeadProps) {
  useEffect(() => {
    // Update Title
    if (title) {
      document.title = `${title} | Ice Skating Index`;
    } else {
      document.title = 'Ice Skating Index';
    }

    // Update Meta Description
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', description);
      }
      
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute('content', description);
      }
    }

    // Update OG Image
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
