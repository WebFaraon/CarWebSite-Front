import { Link } from 'react-router-dom'
import { SOCIAL_PATHS, type SocialKey } from './AmIcons'

const SOCIAL_KEYS: SocialKey[] = ['facebook', 'instagram', 'x', 'linkedin']

function AmFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="am-shell am-foot">
      <div className="am-foot-grid">
        <div className="am-foot-brand">
          <Link to="/" className="am-brand" aria-label="AutoMarket home">
            <span className="am-brand-mark">A</span>
            <span>AutoMarket</span>
          </Link>
          <p className="am-foot-tagline">
            A calmer marketplace for buying and selling cars. Verified sellers,
            transparent listings, no upsells.
          </p>
          <div className="am-foot-social">
            {SOCIAL_KEYS.map((k) => (
              <a
                key={k}
                href="#"
                className="am-iconbtn am-foot-social-btn"
                aria-label={k}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={SOCIAL_PATHS[k]} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="am-foot-col">
          <h4>Explore</h4>
          <ul>
            <li>
              <Link to="/offers">Browse cars</Link>
            </li>
            <li>
              <Link to="/offers">New arrivals</Link>
            </li>
            <li>
              <Link to="/offers">Electric vehicles</Link>
            </li>
            <li>
              <Link to="/offers">Luxury cars</Link>
            </li>
            <li>
              <Link to="/offers">SUVs &amp; crossovers</Link>
            </li>
          </ul>
        </div>

        <div className="am-foot-col">
          <h4>Company</h4>
          <ul>
            <li>
              <Link to="/">About us</Link>
            </li>
            <li>
              <Link to="/sell">Sell your car</Link>
            </li>
            <li>
              <Link to="/contact-us">Contact</Link>
            </li>
            <li>
              <Link to="/help">Help center</Link>
            </li>
            <li>
              <Link to="/help">FAQ</Link>
            </li>
          </ul>
        </div>

      </div>

      <div className="am-foot-bottom">
        <div>© {year} AutoMarket. All rights reserved.</div>
        <div className="am-foot-bottom-links">
          <a href="#">Privacy policy</a>
          <a href="#">Terms of service</a>
          <a href="#">Cookie settings</a>
        </div>
      </div>
    </footer>
  )
}

export default AmFooter
