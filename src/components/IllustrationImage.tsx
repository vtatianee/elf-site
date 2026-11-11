import type { Illustration } from '@/lib/illustrations'

type Props = {
  /** From `getIllustration()` — see src/lib/illustrations.ts. */
  illustration: Illustration
  /**
   * Set on the ONE main image of a page (the vertical illustration of an idea
   * page): it is loaded first. Every other image is lazy-loaded.
   */
  priority?: boolean
  className?: string
}

/**
 * The one way to put an illustration on a page.
 *
 * A plain <img> on purpose: the site is a static export without an image
 * server, so `next/image` would add JavaScript without optimizing anything.
 * Width and height always come from the illustration contract, so the page
 * reserves the space and nothing jumps while loading (CLS = 0).
 *
 * The alt text always starts with "Illustration of" (built by the resolver).
 */
export function IllustrationImage({ illustration, priority = false, className }: Props) {
  return (
    <img
      src={illustration.src}
      alt={illustration.alt}
      width={illustration.width}
      height={illustration.height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={className}
    />
  )
}
