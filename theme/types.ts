export type SocialPlatform =
  | 'linkedin'
  | 'github'
  | 'twitter'
  | 'x'
  | 'mastodon'
  | 'bsky'
  | 'youtube'

export interface SocialLink {
  platform: SocialPlatform
  handle: string
  url?: string // optional override; otherwise built from platform + handle
}

export interface Presenter {
  slug: string
  name: string
  title: string
  photo?: string
  initials: string
  bio: string
  socials: SocialLink[]
  email?: string
  address?: string
  city?: string
}

export interface TeamMember {
  slug: string
  qr?: string
}

export interface Team {
  slug: string
  name: string
  tagline?: string
  members: (string | TeamMember)[] // presenter slugs, or objects with qr field
}

export interface Program {
  slug: string
  tagline: string
  description: string
  engagementLinks: { label: string; url: string }[]
}

export interface Disclaimers {
  'forward-looking': string
  informational: string
  'safe-harbor': string
  [key: string]: string
}

export interface Event {
  name: string
  date: string
  venue?: string
  hashtag?: string
  defaultPresenter: string
  /**
   * Deck-wide default classification. When a slide's frontmatter doesn't
   * set its own `classification:`, layouts fall back to this value.
   * Set to `'PUBLIC'` for external talks; layouts default to `'INTERNAL'`
   * when neither slide nor event sets one (safer default for SAP-internal
   * use). Use `null` to suppress the footer entirely.
   */
  classification?: 'PUBLIC' | 'EXTERNAL' | 'INTERNAL' | 'CONFIDENTIAL' | null
}

export interface RoadmapPhase {
  label: string
  status: 'planned' | 'in-development' | 'available'
  items: string[]
}
