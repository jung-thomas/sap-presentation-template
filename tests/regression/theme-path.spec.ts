import { test, expect } from '@playwright/test'

// Regression lock for the v0.4.4 theme-path bug.
//
// Slidev resolves the front-matter `theme:` key relative to the markdown
// file's directory. pages/all-layouts.md must declare `theme: ../theme`,
// not `./theme`, or every layout silently falls back to Slidev's built-in
// default theme and the entire VR baseline set becomes meaningless.
//
// This test fetches the compiled slide module for a known themed slide
// (the table layout) and asserts the InjectedLayout import points at the
// project's theme, not @slidev/client. If someone "fixes" the path back
// to ./theme, this fails immediately — long before the VR diffs would.
test.describe('theme-path regression', () => {
  test('gallery slide compiles against project theme, not built-in default', async ({
    request
  }) => {
    // Slide 74 in the gallery has `layout: table`. With the theme correctly
    // resolved, the compiled module imports theme/layouts/table.vue. With
    // the theme broken, it imports @slidev/client/layouts/default.vue.
    const res = await request.get('/all-layouts.md__slidev_74.md?import')
    expect(res.ok()).toBe(true)
    const body = await res.text()
    expect(body).toMatch(/theme[\\/]layouts[\\/]table\.vue/)
    expect(body).not.toMatch(/@slidev[\\/]client[\\/]layouts[\\/]default\.vue/)
  })

  test('gallery <Bio> tag resolves to theme component, not bi/o icon', async ({
    request
  }) => {
    // Slide 82 in the gallery uses <Bio presenter="thomas-jung" />. With the
    // theme correctly resolved, theme/components/Bio.vue is scanned and the
    // tag resolves cleanly. With the theme broken, unplugin-icons hijacks
    // <Bio> as a Bootstrap Icons lookup `bi/o` and Vite throws.
    const res = await request.get('/all-layouts.md__slidev_82.md?import')
    expect(res.ok()).toBe(true)
    const body = await res.text()
    expect(body).toMatch(/theme[\\/]components[\\/]Bio\.vue/)
    expect(body).not.toMatch(/~icons[\\/]bi[\\/]o/)
  })
})
