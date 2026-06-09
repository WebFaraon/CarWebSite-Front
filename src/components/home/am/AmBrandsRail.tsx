import { Link } from 'react-router-dom'

const BRANDS = [
  'BMW',
  'Audi',
  'Tesla',
  'Toyota',
  'Mercedes-Benz',
  'Honda',
  'Volkswagen',
  'Ford',
]

function AmBrandsRail() {
  return (
    <section className="am-brands" aria-label="Featured brands">
      <div className="am-brands-head">
        <div className="am-brands-label">Jump to a brand</div>
        <Link to="/offers" className="am-text-link">
          All 42 brands →
        </Link>
      </div>
      <div className="am-brands-rail">
        {BRANDS.map((b) => (
          <Link key={b} to="/offers" className="am-brand-chip">
            {b}
          </Link>
        ))}
      </div>
    </section>
  )
}

export default AmBrandsRail
