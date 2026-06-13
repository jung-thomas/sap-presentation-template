import type { SocialLink } from '../types'

const TEMPLATES: Record<string, (handle: string) => string> = {
  linkedin: (h) => `https://www.linkedin.com/in/${h}`,
  github: (h) => `https://github.com/${h}`,
  twitter: (h) => `https://twitter.com/${h}`,
  x: (h) => `https://x.com/${h}`,
  bsky: (h) => `https://bsky.app/profile/${h}`,
  youtube: (h) => `https://youtube.com/@${h}`,
  mastodon: (h) => `https://mastodon.social/@${h}` // user can override via url
}

export function socialUrl(link: SocialLink): string {
  if (link.url) return link.url
  const tmpl = TEMPLATES[link.platform]
  if (!tmpl) throw new Error(`unknown social platform: ${link.platform}`)
  return tmpl(link.handle)
}
