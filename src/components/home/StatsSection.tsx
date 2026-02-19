import type { StatItem } from './types'

interface StatsSectionProps {
  stats: StatItem[]
}

function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="stats-section section-spacer">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat) => (
            <article key={stat.id} className="stat-card">
              <strong>{stat.value}</strong>
              <p>{stat.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
