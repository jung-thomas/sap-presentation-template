/**
 * Logo clear-space keep-out box, as percentages of the slide canvas.
 * top/left are relative to the slide's top-left; width/height are box dimensions.
 *
 * The box surrounds the SAP logo with 1x logo-height padding on every side
 * (preferred clear-space per SAP brand guidelines; minimum is 0.5x).
 */
export interface KeepOut {
  top: number // percent of slide height
  left: number // percent of slide width
  width: number // percent of slide width
  height: number // percent of slide height
}

/**
 * Compute logo clear-space keep-out box per SAP brand: the logo bounding box
 * plus 1x logo-height padding on every side.
 *
 * Inputs are POTX-derived percentages (cover-tokens.css). slideAspect is
 * width/height (16/9 for our deck).
 */
export function computeKeepOut(input: {
  logoTop: number // % of slide height
  logoLeft: number // % of slide width
  logoWidth: number // % of slide width
  slideAspect: number // width / height
  logoAspectRatio?: number // logoWidth / logoHeight, default 2 (POTX shield)
}): KeepOut {
  const aspect = input.logoAspectRatio ?? 2
  // Convert logo width-% (of slide width) to height-% (of slide height).
  // logoHeight_px = logoWidth_px / aspect
  // logoHeight_% = (logoWidth_px / aspect) / slideHeight_px * 100
  //              = (logoWidth_% * slideWidth_px / 100 / aspect) / slideHeight_px * 100
  //              = logoWidth_% * slideAspect / aspect
  const logoHeight = (input.logoWidth * input.slideAspect) / aspect
  return {
    top: input.logoTop - logoHeight,
    left: input.logoLeft - input.logoWidth,
    width: input.logoWidth * 3,
    height: logoHeight * 3
  }
}
