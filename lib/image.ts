const CLOUDINARY_HOST = "res.cloudinary.com";
const UPLOAD_SEGMENT = "/image/upload/";
const VERSIONED_PATH = /^v\d+\//;

export const getOptimizedImageUrl = (
  url: string,
  size: { width: number; height: number },
): string => {
  if (!url) return url;

  try {
    const parsed = new URL(url);
    if (parsed.hostname !== CLOUDINARY_HOST) return url;

    const index = parsed.pathname.indexOf(UPLOAD_SEGMENT);
    if (index === -1) return url;

    const prefix = parsed.pathname.slice(0, index + UPLOAD_SEGMENT.length);
    const rest = parsed.pathname.slice(prefix.length);

    if (!VERSIONED_PATH.test(rest)) return url;

    parsed.pathname = `${prefix}c_fill,g_auto,w_${size.width},h_${size.height},q_auto,f_auto/${rest}`;
    return parsed.toString();
  } catch {
    return url;
  }
};
