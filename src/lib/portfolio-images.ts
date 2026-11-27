/** Responsive sources for an image in /public/portfolio (exported at 720px and 1280px wide). */
export function imageSources(file: string) {
  return {
    src: `/portfolio/${file}-1280.jpg`,
    srcSet: `/portfolio/${file}-720.jpg 720w, /portfolio/${file}-1280.jpg 1280w`,
  };
}
