import { defineAppSetup } from '@slidev/types'

// Register the UI5 Web Components we use across slides.
// Selective imports keep the bundle small.
import '@ui5/webcomponents/dist/Card.js'
import '@ui5/webcomponents/dist/CardHeader.js'
import '@ui5/webcomponents/dist/Avatar.js'
import '@ui5/webcomponents/dist/Button.js'
import '@ui5/webcomponents/dist/Tag.js'
import '@ui5/webcomponents-fiori/dist/Timeline.js'
import '@ui5/webcomponents-fiori/dist/TimelineItem.js'

import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme.js'

// Wire up font configuration.
import './font'

/**
 * P-2 patch: Slidev's `Goto` dialog (#slidev-goto-dialog, opened with `g`)
 * has no visible close affordance — users only learn `Escape`/click-outside
 * dismissal by accident. We inject a real `<button>` into the input row
 * that dispatches a synthetic `Escape` keydown on Slidev's input, which
 * uses Slidev's existing `@keydown.escape="close"` handler in Goto.vue.
 *
 * Has to run on app mount (after `defineAppSetup`) because the dialog
 * element is rendered by Slidev's client and isn't in the DOM until first
 * mount. We use a MutationObserver to wait for the element to appear.
 */
function installGotoDialogCloseButton() {
  const inject = (dialog: HTMLElement) => {
    // Guard against double-injection on HMR / repeated DOM mutations.
    if (dialog.querySelector('.theme-goto-close')) return
    const inputRow = dialog.querySelector('div')
    if (!inputRow) return
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'theme-goto-close'
    btn.setAttribute('aria-label', 'Close goto dialog')
    btn.title = 'Close (Esc)'
    btn.textContent = '×'
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      const input = dialog.querySelector<HTMLInputElement>('#slidev-goto-input')
      input?.focus()
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })
    inputRow.appendChild(btn)
  }

  const tryInject = () => {
    const dialog = document.getElementById('slidev-goto-dialog')
    if (dialog instanceof HTMLElement) {
      inject(dialog)
      return true
    }
    return false
  }

  if (tryInject()) return

  // Wait for the dialog to mount. Slidev renders it once per app instance.
  const observer = new MutationObserver(() => {
    if (tryInject()) observer.disconnect()
  })
  observer.observe(document.body, { childList: true, subtree: true })
  // Safety: stop observing after 10 s — if the dialog never mounts, the
  // user isn't using Slidev's stock client and our patch isn't needed.
  setTimeout(() => observer.disconnect(), 10_000)
}

export default defineAppSetup(({ app: _app, router: _router }) => {
  // Force Horizon theme for UI5 Web Components.
  setTheme('sap_horizon')

  // Inject a visible close button into Slidev's goto dialog (P-2).
  // Defer to next tick so the app has mounted.
  if (typeof window !== 'undefined') {
    queueMicrotask(() => {
      installGotoDialogCloseButton()
    })
  }
})

