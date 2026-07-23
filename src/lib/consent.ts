export type Consent = 'granted' | 'denied'

const KEY = 'frames.consent.v1'

export function loadConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw === 'granted' || raw === 'denied' ? raw : null
  } catch {
    return null
  }
}

export function saveConsent(value: Consent): void {
  try {
    window.localStorage.setItem(KEY, value)
  } catch {
    // no-op
  }
}

function injectSrc(src: string): void {
  const s = document.createElement('script')
  s.async = true
  s.src = src
  document.head.appendChild(s)
}

function injectInline(code: string): void {
  const s = document.createElement('script')
  s.text = code
  document.head.appendChild(s)
}

let enabled = false

/**
 * Loads the analytics stack (Google Analytics, Snitcher, LinkedIn Insight
 * Tag). Only ever called after the visitor grants consent. Idempotent.
 */
export function enableTracking(): void {
  if (enabled) return
  enabled = true

  // Google Analytics
  injectSrc('https://www.googletagmanager.com/gtag/js?id=G-MSR44ZTKNM')
  injectInline(
    "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-MSR44ZTKNM');",
  )

  // Snitcher
  injectInline(
    `!function (e) { "use strict"; var t = e && e.namespace; if (t && e.profileId && e.cdn) { var i = window[t]; if (i && Array.isArray(i) || (i = window[t] = []), !i.initialized && !i._loaded) if (i._loaded) console && console.warn("[Radar] Duplicate initialization attempted"); else { i._loaded = !0;["track", "page", "identify", "group", "alias", "ready", "debug", "on", "off", "once", "trackClick", "trackSubmit", "trackLink", "trackForm", "pageview", "screen", "reset", "register", "setAnonymousId", "addSourceMiddleware", "addIntegrationMiddleware", "addDestinationMiddleware", "giveCookieConsent"].forEach((function (e) { var a; i[e] = (a = e, function () { var e = window[t]; if (e.initialized) return e[a].apply(e, arguments); var i = [].slice.call(arguments); return i.unshift(a), e.push(i), e }) })), -1 === e.apiEndpoint.indexOf("http") && (e.apiEndpoint = "https://" + e.apiEndpoint), i.bootstrap = function () { var t, i = document.createElement("script"); i.async = !0, i.type = "text/javascript", i.id = "__radar__", i.setAttribute("data-settings", JSON.stringify(e)), i.src = [-1 !== (t = e.cdn).indexOf("http") ? "" : "https://", t, "/releases/latest/radar.min.js"].join(""); var a = document.scripts[0]; a.parentNode.insertBefore(i, a) }, i.bootstrap() } } else "undefined" != typeof console && console.error("[Radar] Configuration incomplete") }({ "apiEndpoint": "radar.snitcher.com", "cdn": "cdn.snitcher.com", "namespace": "Snitcher", "profileId": "8425340" });`,
  )

  // LinkedIn Insight Tag
  injectInline(
    `_linkedin_partner_id = "498884"; window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []; window._linkedin_data_partner_ids.push(_linkedin_partner_id); (function (l) { if (!l) { window.lintrk = function (a, b) { window.lintrk.q.push([a, b]) }; window.lintrk.q = [] } var s = document.getElementsByTagName("script")[0]; var b = document.createElement("script"); b.type = "text/javascript"; b.async = true; b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js"; s.parentNode.insertBefore(b, s); })(window.lintrk);`,
  )
}
