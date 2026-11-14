import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.jpg', { eager: true });

export const photo = (name: string): ImageMetadata => {
  const hit = files[`../assets/photos/${name}.jpg`];
  if (!hit) throw new Error(`Missing photo: ${name}`);
  return hit.default;
};
