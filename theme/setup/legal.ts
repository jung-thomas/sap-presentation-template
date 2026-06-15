// theme/setup/legal.ts
//
// Single-source legal-notice text rendered by <LegalNotice> on closing slides.
// SAP corporate © string with year templated at module-load time.
//
// To update the wording, edit LEGAL_NOTICE here. Authors who need a per-deck
// override can pass `legalNotice:` in their slide front-matter (handled by
// <LegalNotice>'s `:override` prop).

const YEAR = new Date().getFullYear()

export const LEGAL_NOTICE = `© ${YEAR} SAP SE or an SAP affiliate company. All rights reserved.`

/** Resolve the legal notice text, preferring an explicit override when truthy. */
export function getLegalNotice(override?: string | null): string {
  return override && override.trim().length > 0 ? override : LEGAL_NOTICE
}
