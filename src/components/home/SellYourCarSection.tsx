interface SellYourCarSectionProps {
  image: string
}

function SellYourCarSection({ image }: SellYourCarSectionProps) {
  return (
    <section id="sell" className="sell-section section-spacer">
      <div className="container">
        <div className="sell-layout">
          <div className="sell-copy">
            <h2>Sell your car in minutes</h2>
            <p>
              Create your listing, connect with verified buyers, and complete
              the deal with confidence through our secure process.
            </p>
            <button className="primary-btn" type="button">
              Sell Your Car
            </button>
          </div>

          <div className="sell-image-wrap">
            <div className="sell-orb sell-orb-one" aria-hidden="true" />
            <div className="sell-orb sell-orb-two" aria-hidden="true" />
            <div className="sell-floating-chip" aria-hidden="true">
              2.4k+ active buyers
            </div>
            <img src={image} alt="Sell your car listing placeholder" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default SellYourCarSection
