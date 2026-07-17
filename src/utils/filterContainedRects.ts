/**
 * Drop spurious "containing" rects from a list of `Range.getClientRects()`
 * results before they are painted as highlight fills.
 *
 * epub.js draws one filled SVG `<rect>` per client rect (see `Highlight.render`
 * / `Mark.filteredRanges` in `epubjs.ts`). When a selection spans multiple block
 * elements, WebKit returns — for each fully-enclosed middle block — a rect that
 * spans the block's full content-box width, IN ADDITION to the tight per-line
 * text rects (CSSOM behavior; WebKit bug 76839, w3c/csswg-drafts#12331). Painted
 * as plain alpha fills, that block rect shades the whole paragraph width and, by
 * overlapping the line rects, reads as a darker "double highlight". The
 * `mix-blend-mode: multiply` epub.js sets is inert here because marks-pane
 * renders the SVG as a sibling of the iframe — see
 * apps/mobile/src/components/epub-reader/HIGHLIGHTS.md.
 *
 * Genuine same-line text rects are horizontally disjoint (one rect per visual
 * row; inline boxes tile side-by-side), so a rect that fully contains another
 * rect can only be the spurious block-level rect. This drops zero-area rects and
 * any rect that contains a smaller rect, with a 1px tolerance for sub-pixel
 * jitter.
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
  const nonEmpty = rects.filter(
    (rect) => rect.width > TOLERANCE && rect.height > TOLERANCE
  );

  return nonEmpty.filter(
    (candidate) =>
      !nonEmpty.some(
        (other) => other !== candidate && contains(candidate, other)
      )
  );
}
