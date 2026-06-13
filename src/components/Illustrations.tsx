const illustrations = [
  {
    caption: "Punkt — omalovánka",
    image: "/images/illustration-punkt.jpg"
  },
  {
    caption: "Bonghemia — ilustrace",
    image: "/images/illustration-bonghemia.jpg"
  },
  {
    caption: "Vltavská",
    image: "/images/illustration-vltavska.jpg"
  },
  {
    caption: "Swap & Sip",
    image: "/images/illustration-swap-sip.jpg"
  },
  {
    caption: "Barvy & Beaty",
    image: "/images/illustration-barvy-beaty.jpg"
  },
  {
    caption: "Five Elephant Takeover",
    image: "/images/illustration-five-elephant.jpg"
  }
];

export function Illustrations() {
  return (
    <section className="section illustrations-section" id="ilustrace">
      <div className="ill-top">
        <span className="ill-kicker">Vybrané ilustrace</span>
        <p>
          Výběr ilustrací napříč projekty — brandové motivy, vizuální prvky pro sociální sítě, merch a tiskové
          výstupy.
        </p>
      </div>

      <div className="ill-title-row">
        <h2 className="ill-title">Ilustrace</h2>
      </div>

      <div className="ill-carousel">
        <div className="ill-track">
          {illustrations.map((item) => (
            <figure className="ill-card" key={item.caption} data-cursor-label={item.caption}>
              <img src={item.image} alt={item.caption} decoding="async" loading="lazy" />
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
