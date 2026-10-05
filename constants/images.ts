export const IMAGE_SIZES = {
  cover: { width: 1200, height: 630 },
  card: { width: 800, height: 420 },
  thumb: { width: 96, height: 96 },
} as const;

export type ImageVariant = keyof typeof IMAGE_SIZES;
