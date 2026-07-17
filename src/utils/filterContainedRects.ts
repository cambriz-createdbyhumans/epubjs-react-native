/**
 * Drop spurious "containing" rects from `Range.getClientRects()` before they
 * are painted as highlight fills.
 *
 * For a selection spanning multiple blocks, WebKit returns a full-width rect for
 * each fully-enclosed middle block on top of the per-line text rects (WebKit bug
 * 76839). epub.js paints one fill per rect, and since the SVG pane is a sibling
 * of the iframe, `mix-blend-mode: multiply` can't apply — so the overlap darkens
 * and the block rect shades the whole paragraph ("double highlight").
 *
 * Same-line text rects are horizontally disjoint, so a rect that contains
 * another can only be the block rect. Drops empty rects and any containing rect,
 * with a 1px tolerance for sub-pixel jitter.
 */

interface RectLike {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}

const TOLERANCE = 1;

function contains(outer: RectLike, inner: RectLike): boolean {
  const enclosesHorizontally =
    outer.left <= inner.left + TOLERANCE &&
    outer.right >= inner.right - TOLERANCE;
  const enclosesVertically =
    outer.top <= inner.top + TOLERANCE &&
    outer.bottom >= inner.bottom - TOLERANCE;
  const strictlyLarger =
    outer.width > inner.width + TOLERANCE ||
    outer.height > inner.height + TOLERANCE;

  return enclosesHorizontally && enclosesVertically && strictlyLarger;
}

export function filterContainedRects<T extends RectLike>(rects: T[]): T[] {
  const nonEmpty = rects.filter((rect) => rect.width > 0 && rect.height > 0);

  return nonEmpty.filter(
    (candidate) =>
      !nonEmpty.some(
        (other) => other !== candidate && contains(candidate, other)
      )
  );
}
