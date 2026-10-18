import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ShoppingBag, Search, ArrowLeft, ArrowRight, X, Plus, Minus,
  Trash2, MessageCircle,
} from "lucide-react";

const categories = ["Tous", "Parfums", "Montres", "Lunettes", "Habits"];
const STORAGE_KEY = "alchimiaShopProducts";
const CART_KEY = "alchimiaShopCart";
const WHATSAPP_NUMBER = "221785337675";

function getProducts() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function getSavedCart() {
  try {
    const data = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function formatPrice(price) {
  const value = Number(price);
  return Number.isFinite(value)
    ? `${value.toLocaleString("fr-FR")} FCFA`
    : "Prix sur demande";
}

function getProductId(product, index = 0) {
  return String(product.id ?? product._id ?? `${product.name || product.nom || "produit"}-${index}`);
}

export default function Boutique() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products] = useState(getProducts);
  const [cart, setCart] = useState(getSavedCart);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "Tous");
  const [cartOpen, setCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNote, setCustomerNote] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Impossible de sauvegarder le panier :", error);
    }
  }, [cart]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const name = String(product.name || product.nom || "").toLowerCase();
      const description = String(product.description || "").toLowerCase();
      const productCategory = String(product.category || product.categorie || "");
      const matchesSearch = !query || name.includes(query) ||
        description.includes(query) || productCategory.toLowerCase().includes(query);
      const matchesCategory = category === "Tous" ||
        productCategory.toLowerCase() === category.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const cartItems = useMemo(() => cart.map((item) => {
    const product = products.find((p, index) => getProductId(p, index) === String(item.id));
    if (!product) return null;
    const price = Number(product.price ?? product.prix);
    return {
      id: String(item.id),
      product,
      quantity: Math.max(1, Number(item.quantity) || 1),
      price: Number.isFinite(price) ? price : 0,
    };
  }).filter(Boolean), [cart, products]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function updateUrl(nextSearch, nextCategory) {
    const params = new URLSearchParams();
    if (nextSearch.trim()) params.set("search", nextSearch.trim());
    if (nextCategory !== "Tous") params.set("category", nextCategory);
    setSearchParams(params);
  }

  function handleSearch(event) {
    event.preventDefault();
    updateUrl(search, category);
  }

  function changeCategory(value) {
    setCategory(value);
    updateUrl(search, value);
  }

  function addToCart(product, index) {
    const id = getProductId(product, index);
    const stock = Number(product.stock);
    const existing = cart.find((item) => String(item.id) === id);
    const quantity = Number(existing?.quantity || 0);

    if (Number.isFinite(stock) && stock >= 0 && quantity >= stock) {
      window.alert(stock === 0
        ? "Ce produit est en rupture de stock."
        : "La quantité disponible en stock est atteinte.");
      return;
    }

    setCart((current) => {
      const found = current.find((item) => String(item.id) === id);
      return found
        ? current.map((item) => String(item.id) === id
            ? { ...item, quantity: Number(item.quantity || 1) + 1 }
            : item)
        : [...current, { id, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function changeQuantity(id, delta) {
    setCart((current) => current.map((item) =>
      String(item.id) === String(id)
        ? { ...item, quantity: Math.max(0, Number(item.quantity || 1) + delta) }
        : item
    ).filter((item) => item.quantity > 0));
  }

  function removeFromCart(id) {
    setCart((current) => current.filter((item) => String(item.id) !== String(id)));
  }

  function sendWhatsAppOrder(event) {
    event.preventDefault();
    if (cartItems.length === 0) {
      window.alert("Ton panier est vide.");
      return;
    }

    const message = [
      "Bonjour Sadikhshop ! Je souhaite commander :",
      "",
      ...cartItems.map((item) =>
        `• ${item.product.name || item.product.nom || "Produit"} x${item.quantity} — ${formatPrice(item.price * item.quantity)}`
      ),
      "",
      `TOTAL ESTIMÉ : ${formatPrice(cartTotal)}`,
      "",
      `Nom : ${customerName.trim() || "À préciser"}`,
      `Adresse de livraison : ${customerAddress.trim() || "À préciser"}`,
      `Note : ${customerNote.trim() || "Aucune"}`,
      "",
      "Merci de me confirmer la disponibilité et les modalités de livraison.",
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="shop-page">
      <header className="shop-header">
        <Link to="/" className="home-logo">
          <span className="home-logo-icon"><ShoppingBag size={23} /></span>
          <span>Sadikh<span className="home-logo-accent">SHOP</span></span>
        </Link>
        <div className="shop-header-actions">
          <button type="button" className="shop-cart-button" onClick={() => setCartOpen((open) => !open)} aria-expanded={cartOpen}>
            <ShoppingBag size={18} /> Panier <span className="shop-cart-count">{cartCount}</span>
          </button>
          <Link to="/" className="shop-back-link"><ArrowLeft size={18} /> Accueil</Link>
        </div>
      </header>

      <main className="shop-main">
        <section className="shop-intro">
          <span className="home-eyebrow home-eyebrow-dark">DÉCOUVREZ NOTRE COLLECTION</span>
          <h1>Notre boutique</h1>
          <p>Trouvez les produits qui correspondent à votre style.</p>
        </section>

        {cartOpen && (
          <section className="shop-cart-panel" aria-label="Votre panier">
            <div className="shop-cart-heading">
              <div>
                <span className="home-eyebrow home-eyebrow-dark">VOTRE SÉLECTION</span>
                <h2>Mon panier ({cartCount})</h2>
              </div>
              <button type="button" className="shop-icon-button" onClick={() => setCartOpen(false)} aria-label="Fermer le panier"><X size={20} /></button>
            </div>

            {cartItems.length === 0 ? (
              <p className="shop-cart-empty">Ton panier est vide. Ajoute un produit pour commencer.</p>
            ) : (
              <>
                <div className="shop-cart-items">
                  {cartItems.map((item) => (
                    <article className="shop-cart-item" key={item.id}>
                      <div className="shop-cart-item-info">
                        <strong>{item.product.name || item.product.nom || "Produit"}</strong>
                        <span>{formatPrice(item.price)} l’unité</span>
                        <b>{formatPrice(item.price * item.quantity)}</b>
                      </div>
                      <div className="shop-quantity-controls">
                        <button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label="Diminuer la quantité"><Minus size={15} /></button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.id, 1)}
                          aria-label="Augmenter la quantité"
                          disabled={Number.isFinite(Number(item.product.stock)) && item.quantity >= Number(item.product.stock)}
                        ><Plus size={15} /></button>
                        <button type="button" className="shop-remove-item" onClick={() => removeFromCart(item.id)} aria-label="Supprimer du panier"><Trash2 size={16} /></button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="shop-cart-total"><span>Total estimé</span><strong>{formatPrice(cartTotal)}</strong></div>

                <form className="shop-checkout-form" onSubmit={sendWhatsAppOrder}>
                  <h3>Informations de commande</h3>
                  <label>Ton nom
                    <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Nom et prénom" />
                  </label>
                  <label>Adresse de livraison
                    <input value={customerAddress} onChange={(event) => setCustomerAddress(event.target.value)} placeholder="Quartier, ville..." />
                  </label>
                  <label>Note (facultatif)
                    <textarea value={customerNote} onChange={(event) => setCustomerNote(event.target.value)} placeholder="Couleur, taille ou précision..." rows={2} />
                  </label>
                  <button className="shop-whatsapp-button" type="submit"><MessageCircle size={19} /> Commander sur WhatsApp</button>
                  <p className="shop-checkout-hint">Le message s’ouvrira dans WhatsApp. La livraison et le paiement seront confirmés avec la boutique.</p>
                </form>
              </>
            )}
          </section>
        )}

        <form className="shop-search" onSubmit={handleSearch}>
          <Search size={21} />
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un parfum, une montre..." aria-label="Rechercher des produits" />
          {search && (
            <button type="button" className="shop-clear-search" onClick={() => { setSearch(""); updateUrl("", category); }} aria-label="Effacer la recherche"><X size={18} /></button>
          )}
          <button type="submit" className="shop-search-button">Rechercher</button>
        </form>

        <div className="shop-categories">
          {categories.map((item) => (
            <button key={item} type="button" className={`shop-category-filter ${category === item ? "active" : ""}`} onClick={() => changeCategory(item)}>{item}</button>
          ))}
        </div>

        <div className="shop-results-heading">
          <h2>{category === "Tous" ? "Tous nos produits" : category}</h2>
          <span>{filteredProducts.length} article(s)</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="home-product-grid">
            {filteredProducts.map((product, index) => {
              const id = getProductId(product, index);
              const inCart = cart.find((item) => String(item.id) === id);
              const stock = Number(product.stock);
              const soldOut = Number.isFinite(stock) && stock === 0;

              return (
                <article className="home-product-card shop-product-card" key={id}>
                  <div className="home-product-image">
                    <img src={product.image || product.imageUrl || product.photo || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"} alt={product.name || product.nom || "Produit"} />
                  </div>
                  <div className="home-product-info">
                    <span className="home-product-category">{product.category || product.categorie || "Collection"}</span>
                    <h3>{product.name || product.nom || "Produit"}</h3>
                    {product.description && <p className="shop-product-description">{product.description}</p>}
                    <div className="home-product-bottom">
                      <strong>{formatPrice(product.price ?? product.prix ?? "Prix sur demande")}</strong>
                      <span className="home-product-arrow"><ArrowRight size={18} /></span>
                    </div>
                    <button type="button" className="shop-add-to-cart" onClick={() => addToCart(product, index)} disabled={soldOut}>
                      <ShoppingBag size={17} />
                      {soldOut ? "Rupture de stock" : inCart ? `Ajouter encore (${inCart.quantity})` : "Ajouter au panier"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="shop-empty">
            <ShoppingBag size={42} />
            <h2>Aucun produit trouvé</h2>
            <p>Essaie une autre recherche ou sélectionne une autre catégorie.</p>
            <button type="button" className="home-btn home-btn-primary" onClick={() => { setSearch(""); setCategory("Tous"); setSearchParams({}); }}>Voir tous les produits</button>
          </div>
        )}
      </main>

      <footer className="home-footer-bottom shop-footer">
        <p>© {new Date().getFullYear()} AlchimiaShop. Tous droits réservés.</p>
        <Link to="/">Retour à l'accueil</Link>
      </footer>
    </div>
  );
}
