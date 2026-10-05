export const getSafeRedirect = (from?: string): string => {
  if (!from || !/^\/(?![/\\])/.test(from)) return "/";

  return from.startsWith("/login") ? "/" : from;
};
