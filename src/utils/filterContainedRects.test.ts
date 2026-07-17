import { filterContainedRects } from './filterContainedRects';

interface RectLike {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}

describe('filterContainedRects', () => {
  it('drops full-width block rect when it fully encloses narrower line rects', () => {
    // Multi-block selection: a spurious block rect that spans the full paragraph
    // width plus two narrower line rects on different rows
    const fullWidthBlockRect: RectLike = {
      top: 100,
      left: 20,
      bottom: 150,
      right: 400,
      width: 380,
      height: 50,
    };
    const lineRect1: RectLike = {
      top: 100,
      left: 20,
      bottom: 120,
      right: 200,
      width: 180,
      height: 20,
    };
    const lineRect2: RectLike = {
      top: 130,
      left: 20,
      bottom: 150,
      right: 180,
      width: 160,
      height: 20,
    };

    const input = [fullWidthBlockRect, lineRect1, lineRect2];
    const result = filterContainedRects(input);

    // Expect the block rect dropped and BOTH line rects kept
    expect(result).toEqual([lineRect1, lineRect2]);
  });

  it('returns the same rect when input has a single line rect', () => {
    const singleRect: RectLike = {
      top: 100,
      left: 20,
      bottom: 120,
      right: 200,
      width: 180,
      height: 20,
    };

    const result = filterContainedRects([singleRect]);

    expect(result).toEqual([singleRect]);
  });

  it('keeps disjoint same-line inline rects (neither contains the other)', () => {
    // Two rects on the same row, side by side, neither containing the other
    const rect1: RectLike = {
      top: 100,
      left: 20,
      bottom: 120,
      right: 150,
      width: 130,
      height: 20,
    };
    const rect2: RectLike = {
      top: 100,
      left: 160,
      bottom: 120,
      right: 300,
      width: 140,
      height: 20,
    };

    const result = filterContainedRects([rect1, rect2]);

    expect(result).toEqual([rect1, rect2]);
  });

  it('drops zero-area rects (width or height is zero)', () => {
    const zeroWidthRect: RectLike = {
      top: 100,
      left: 20,
      bottom: 120,
      right: 20,
      width: 0,
      height: 20,
    };
    const zeroHeightRect: RectLike = {
      top: 100,
      left: 20,
      bottom: 100,
      right: 200,
      width: 180,
      height: 0,
    };
    const validRect: RectLike = {
      top: 100,
      left: 20,
      bottom: 120,
      right: 200,
      width: 180,
      height: 20,
    };

    const result = filterContainedRects([
      zeroWidthRect,
      zeroHeightRect,
      validRect,
    ]);

    expect(result).toEqual([validRect]);
  });

  it('drops rect that contains another even with 1px sub-pixel tolerance', () => {
    // A slightly larger outer rect that contains an inner rect within tolerance
    const outerRect: RectLike = {
      top: 99,
      left: 19,
      bottom: 121,
      right: 201,
      width: 182,
      height: 22,
    };
    const innerRect: RectLike = {
      top: 100,
      left: 20,
      bottom: 120,
      right: 200,
      width: 180,
      height: 20,
    };

    const result = filterContainedRects([outerRect, innerRect]);

    // Outer rect should be dropped; inner rect kept
    expect(result).toEqual([innerRect]);
  });
});
