export function wpcomImageLoader({
  src,
  width,
  quality
}: {
  src: string;
  width: string | number;
  quality: string | number;
}) {
  if (src.startsWith("https://")) {
    src = src.split("https://")[1];
  } else if (src.startsWith("http://")) {
    src = src.split("http://")[1];
  }
  return `https://i1.wp.com/${src}?w=${width}&quality=${quality || 70}`;
}