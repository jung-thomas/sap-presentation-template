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

export default defineAppSetup(({ app: _app, router: _router }) => {
  // Force Horizon theme for UI5 Web Components.
  setTheme('sap_horizon')
})
