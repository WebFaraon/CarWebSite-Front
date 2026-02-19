import type { SocialItem, SocialPlatform } from './types'

interface SiteFooterProps {
  socialLinks: SocialItem[]
}

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.5 9H16V6h-2.5A4.5 4.5 0 0 0 9 10.5V13H7v3h2V22h3v-6h2.5l.5-3H12v-2.5A1.5 1.5 0 0 1 13.5 9Z" />
      </svg>
    )
  }

  if (platform === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5Zm4.25 3A5 5 0 1 1 7 12a5 5 0 0 1 5-5Zm0 2a3 3 0 1 0 3 3 3 3 0 0 0-3-3Zm5.25-2.38a1.12 1.12 0 1 1-1.12 1.12 1.12 1.12 0 0 1 1.12-1.12Z" />
      </svg>
    )
  }

  if (platform === 'x') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.9 3H22l-6.78 7.75L23 21h-6.4l-5-6.54L5.87 21H2.74l7.25-8.29L2 3h6.56l4.52 5.96L18.9 3Zm-2.24 16h1.77L7.58 4.9H5.7L16.66 19Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 3A3.5 3.5 0 1 1 3 6.5 3.5 3.5 0 0 1 6.5 3ZM4 9h5v12H4Zm8 0h4.6v1.64h.07A5 5 0 0 1 21 8.32c4.6 0 5 3 5 6.85V21h-5v-5.17c0-1.23 0-2.82-1.72-2.82s-2 1.35-2 2.73V21h-5Z" />
    </svg>
  )
}

function SiteFooter({ socialLinks }: SiteFooterProps) {
  return (
    <footer id="contact" className="site-footer">
      <div className="container footer-layout">
        <a href="#" className="footer-logo">
          AutoMarket
        </a>
        <p className="footer-note">Trusted by thousands of buyers and sellers.</p>

        <div className="social-links">
          {socialLinks.map((item) => (
            <a
              key={item.platform}
              href={item.href}
              aria-label={item.platform}
              className="social-btn"
            >
              <SocialIcon platform={item.platform} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
