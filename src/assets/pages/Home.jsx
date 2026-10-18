
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  ArrowRight,
  Truck,
  ShieldCheck,
  Headphones,
  Star,
  Menu,
  X,
} from "lucide-react";

const categories = [
  {
    name: "Parfums",
    description: "Des fragrances pour chaque occasion",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
    slug: "Parfums",
  },
  {
    name: "Montres",
    description: "L'élégance à votre poignet",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    slug: "Montres",
  },
  {
    name: "Lunettes",
    description: "Affirmez votre style",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    slug: "Lunettes",
  },
  {
    name: "Habits",
    description: "La mode qui vous ressemble",
    
      image: "/images/habits.jpeg",
    slug: "Habits",
  },
];

function getProducts() {
  try {
    const products = JSON.parse(
      localStorage.getItem("alchimiaShopProducts") || "[]"
    );
    return Array.isArray(products) ? products : [];
  } catch {
    return [];
  }
}

function formatPrice(price) {
  const value = Number(price);
  if (!Number.isFinite(value)) return price || "Prix sur demande";

  return `${value.toLocaleString("fr-FR")} FCFA`;
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [products] = useState(getProducts);

  const navigate = useNavigate();

  const featuredProducts = products.slice(0, 4);

  function handleSearch(event) {
    event.preventDefault();

    const query = search.trim();
    if (!query) return;

    navigate(`/boutique?search=${encodeURIComponent(query)}`);
    setMenuOpen(false);
  }

  function goToCategory(category) {
    navigate(`/boutique?category=${encodeURIComponent(category)}`);
    setMenuOpen(false);
  }

  return (
    <div className="home-page">
      {/* BARRE D'ANNONCE */}
      <div className="home-announcement">
        Bienvenue chez SadikhShop — Votre style, notre passion.
      </div>

      {/* NAVIGATION */}
      <header className="home-header">
        <div className="home-navbar">
          
<Link to="/" className="home-logo">
  <img
    src="/images/logot.jpeg"
    alt="AlchimiaShop"
    className="home-logo-image"
  />
</Link>


          <nav className={`home-nav ${menuOpen ? "home-nav-open" : ""}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Accueil
            </Link>

            <Link to="/boutique" onClick={() => setMenuOpen(false)}>
              Boutique
            </Link>

            <a href="#categories" onClick={() => setMenuOpen(false)}>
              Catégories
            </a>

            <a href="#avantages" onClick={() => setMenuOpen(false)}>
              Nos avantages
            </a>
          </nav>

          <div className="home-header-actions">
            <form className="home-search" onSubmit={handleSearch}>
              <input
                type="search"
                placeholder="Rechercher un produit..."
                aria-label="Rechercher un produit"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <button type="submit" aria-label="Lancer la recherche">
                <Search size={19} />
              </button>
            </form>

            <Link
              to="/boutique"
              className="home-cart-link"
              aria-label="Accéder à la boutique"
            >
              <ShoppingBag size={22} />
            </Link>

            <button
              className="home-menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={25} /> : <Menu size={25} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="home-hero">
          <div className="home-hero-overlay" />

          <div className="home-hero-content">
            <span className="home-eyebrow">
              L'ÉLÉGANCE À PORTÉE DE MAIN
            </span>

            <h1>
              Révélez votre style.
              <br />
              <span>Affirmez votre personnalité.</span>
            </h1>

            <p>
              Découvrez notre sélection de parfums, montres, lunettes et
              vêtements pour un style unique au quotidien.
            </p>

            <div className="home-hero-actions">
              <Link to="/boutique" className="home-btn home-btn-primary">
                Découvrir la boutique <ArrowRight size={19} />
              </Link>

              <a
                href="#categories"
                className="home-btn home-btn-outline"
              >
                Explorer les catégories
              </a>
            </div>

            <div className="home-hero-note">
              <span className="home-stars">★★★★★</span>
              <span>Le style commence ici.</span>
            </div>
          </div>
        </section>

        {/* AVANTAGES */}
        <section className="home-benefits" id="avantages">
          <div className="home-benefit">
            <span className="home-benefit-icon">
              <Truck size={25} />
            </span>
            <div>
              <h3>Livraison</h3>
              <p>Des modalités simples et pratiques</p>
            </div>
          </div>

          <div className="home-benefit">
            <span className="home-benefit-icon">
              <ShieldCheck size={25} />
            </span>
            <div>
              <h3>Achat en confiance</h3>
              <p>Un service pensé pour vous</p>
            </div>
          </div>

          <div className="home-benefit">
            <span className="home-benefit-icon">
              <Star size={25} />
            </span>
            <div>
              <h3>Style et qualité</h3>
              <p>Des articles sélectionnés avec soin</p>
            </div>
          </div>

          <div className="home-benefit">
            <span className="home-benefit-icon">
              <Headphones size={25} />
            </span>
            <div>
              <h3>À votre écoute</h3>
              <p>Une équipe disponible pour vous</p>
            </div>
          </div>
        </section>

        {/* CATÉGORIES */}
        <section className="home-section" id="categories">
          <div className="home-section-heading">
            <div>
              <span className="home-eyebrow home-eyebrow-dark">
                TROUVEZ VOTRE STYLE
              </span>
              <h2>Explorez nos catégories</h2>
              <p>
                Des essentiels pour compléter votre look et exprimer votre
                personnalité.
              </p>
            </div>

            <Link to="/boutique" className="home-text-link">
              Toute la boutique <ArrowRight size={18} />
            </Link>
          </div>

          <div className="home-category-grid">
            {categories.map((category) => (
              <button
                key={category.slug}
                className="home-category-card"
                onClick={() => goToCategory(category.slug)}
              >
                <img src={category.image} alt={category.name} />

                <span className="home-category-overlay" />

                <span className="home-category-content">
                  <span className="home-category-label">
                    COLLECTION
                  </span>
                  <strong>{category.name}</strong>
                  <span className="home-category-description">
                    {category.description}
                  </span>
                  <span className="home-category-link">
                    Explorer <ArrowRight size={17} />
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* PRODUITS EN VEDETTE */}
        <section className="home-section home-featured-section">
          <div className="home-section-heading">
            <div>
              <span className="home-eyebrow home-eyebrow-dark">
                NOTRE SÉLECTION
              </span>
              <h2>Nos produits en vedette</h2>
              <p>
                Retrouvez ici les articles ajoutés à votre catalogue.
              </p>
            </div>

            <Link to="/boutique" className="home-text-link">
              Voir tous les produits <ArrowRight size={18} />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="home-product-grid">
              {featuredProducts.map((product, index) => (
                <Link
                  to="/boutique"
                  className="home-product-card"
                  key={product.id ?? product._id ?? index}
                >
                  <div className="home-product-image">
                    <img
                      src={
                        product.image ||
                        product.imageUrl ||
                        product.photo ||
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"
                      }
                      alt={product.name || product.nom || "Produit AlchimiaShop"}
                    />

                    <span className="home-product-badge">À découvrir</span>
                  </div>

                  <div className="home-product-info">
                    <span className="home-product-category">
                      {product.category || product.categorie || "Collection"}
                    </span>

                    <h3>{product.name || product.nom || "Produit"}</h3>

                    <div className="home-product-bottom">
                      <strong>
                        {formatPrice(
                          product.price ?? product.prix ?? "Prix sur demande"
                        )}
                      </strong>
                      <span className="home-product-arrow">
                        <ArrowRight size={18} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="home-empty-products">
              <div className="home-empty-icon">
                <ShoppingBag size={30} />
              </div>

              <h3>Nos nouveautés arrivent bientôt</h3>

              <p>
                Les produits ajoutés à votre catalogue apparaîtront ici.
              </p>

              <Link to="/boutique" className="home-btn home-btn-primary">
                Visiter la boutique <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </section>

        {/* BANNIÈRE */}
        <section className="home-cta">
          <div className="home-cta-content">
            <span className="home-eyebrow">VOTRE STYLE, VOTRE SIGNATURE</span>

            <h2>
              Le détail qui change tout.
            </h2>

            <p>
              Trouvez les articles qui vous correspondent et composez un
              style à votre image avec AlchimiaShop.
            </p>

            <Link to="/boutique" className="home-btn home-btn-light">
              Faire mon shopping <ArrowRight size={19} />
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="home-footer-main">
          <div className="home-footer-brand">
            
<Link to="/" className="home-logo home-footer-logo">
  <img
    src="/images/logot.jpeg"
    alt="AlchimiaShop"
    className="home-logo-image"
  />
</Link>


            <p>
              Votre destination shopping pour les parfums, les accessoires
              et la mode.
            </p>
          </div>

          <div className="home-footer-column">
            <h3>Navigation</h3>
            <Link to="/">Accueil</Link>
            <Link to="/boutique">Boutique</Link>
            <a href="#categories">Catégories</a>
          </div>

          <div className="home-footer-column">
            <h3>Catégories</h3>
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => goToCategory(category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="home-footer-column">
            <h3>Besoin d'aide ?</h3>
            <p>Une question sur un produit ?</p>
            <Link to="/boutique">Consulter la boutique</Link>
          </div>
        </div>

        <div className="home-footer-bottom">
          <p>© {new Date().getFullYear()} AlchimiaShop. Tous droits réservés.</p>
          <span>Le style commence ici.</span>
        </div>
      </footer>
    </div>
  );
}
