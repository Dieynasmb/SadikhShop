import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Plus,
  Trash2,
  ShoppingBag,
  Search,
  ArrowUpRight,
  ImagePlus,
  Store,
  Boxes,
  X,
  CheckCircle2,
  Pencil,
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = ["Parfums", "Montres", "Lunettes", "Habits"];
const STORAGE_KEY = "alchimiaShopProducts";

function readProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Erreur de lecture des produits :", error);
    return [];
  }
}

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString("fr-FR")} FCFA`;
}

export default function Admin() {
  const [products, setProducts] = useState(readProducts);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Parfums");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState("");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error("Erreur de sauvegarde des produits :", error);
      setNotice("Impossible de sauvegarder. Essaie une image plus légère.");
    }
  }, [products]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const totalStock = useMemo(
    () =>
      products.reduce(
        (total, product) => total + Math.max(0, Number(product.stock) || 0),
        0
      ),
    [products]
  );

  const inventoryValue = useMemo(
    () =>
      products.reduce(
        (total, product) =>
          total +
          (Number(product.price) || 0) * (Number(product.stock) || 0),
        0
      ),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;

    return products.filter((product) =>
      `${product.name || ""} ${product.category || ""}`
        .toLowerCase()
        .includes(query)
    );
  }, [products, search]);

  function showNotice(message) {
    setNotice(message);
  }

  function handleImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotice("Choisis un fichier image valide.");
      event.target.value = "";
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      showNotice("L'image doit faire moins de 3 Mo.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result || ""));
    reader.onerror = () => showNotice("Impossible de lire cette image.");
    reader.readAsDataURL(file);
  }

  function resetForm() {
    setName("");
    setPrice("");
    setCategory("Parfums");
    setImage("");
    setStock("");
    setEditingId(null);

    const fileInput = document.getElementById("admin-product-image");
    if (fileInput) fileInput.value = "";
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      showNotice("Le nom du produit est obligatoire.");
      return;
    }

    if (
      price === "" ||
      !Number.isFinite(Number(price)) ||
      Number(price) <= 0
    ) {
      showNotice("Saisis un prix valide supérieur à zéro.");
      return;
    }

    if (
      stock === "" ||
      !Number.isInteger(Number(stock)) ||
      Number(stock) < 0
    ) {
      showNotice("Saisis une quantité entière valide.");
      return;
    }

    const productData = {
      name: name.trim(),
      price: Number(price),
      category,
      image,
      stock: Number(stock),
    };

    if (editingId !== null) {
      setProducts((current) =>
        current.map((product) =>
          String(product.id) === String(editingId)
            ? { ...product, ...productData }
            : product
        )
      );

      resetForm();
      showNotice("Produit modifié avec succès !");
      return;
    }

    const newProduct = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...productData,
      description: "",
    };

    setProducts((current) => [newProduct, ...current]);
    resetForm();
    showNotice("Produit ajouté avec succès !");
  }

  function startEditing(product) {
    if (!product) return;

    setEditingId(product.id);
    setName(product.name || "");
    setPrice(String(product.price ?? ""));
    setCategory(
      categories.includes(product.category) ? product.category : "Parfums"
    );
    setImage(product.image || "");
    setStock(String(product.stock ?? 0));

    const fileInput = document.getElementById("admin-product-image");
    if (fileInput) fileInput.value = "";

    showNotice(`Modification du produit : ${product.name || ""}`);

    window.setTimeout(() => {
      document.getElementById("ajouter")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  function cancelEditing() {
    resetForm();
    showNotice("Modification annulée.");
  }

  function deleteProduct(id) {
    const confirmed = window.confirm("Veux-tu vraiment supprimer ce produit ?");
    if (!confirmed) return;

    setProducts((current) =>
      current.filter((product) => String(product.id) !== String(id))
    );

    if (String(editingId) === String(id)) resetForm();
    showNotice("Produit supprimé.");
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          <span className="admin-brand-mark">A</span>
          <span>
            <strong>SADIKH</strong>
            <small>SHOP</small>
          </span>
        </Link>

        <p className="admin-menu-label">MENU PRINCIPAL</p>

        <nav className="admin-nav">
          <a className="admin-nav-link active" href="#dashboard">
            <LayoutDashboard size={19} />
            <span>Tableau de bord</span>
          </a>
          <a className="admin-nav-link" href="#inventaire">
            <Package size={19} />
            <span>Mes produits</span>
          </a>
          <a className="admin-nav-link" href="#ajouter">
            <Plus size={19} />
            <span>Ajouter un produit</span>
          </a>
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-store-card">
            <span className="admin-store-icon">
              <Store size={20} />
            </span>
            <strong>Ma boutique</strong>
            <p>Gère tes articles en un seul endroit.</p>
            <Link to="/boutique">
              Voir la boutique <ArrowUpRight size={15} />
            </Link>
          </div>

          <Link to="/" className="admin-back-home">
            ← Retour au site
          </Link>
        </div>
      </aside>

      <main className="admin-workspace" id="dashboard">
        <header className="admin-topbar">
          <div>
            <p className="admin-breadcrumb">
              ESPACE ADMINISTRATEUR / ACCUEIL
            </p>
            <h1>Tableau de bord</h1>
          </div>

          <Link to="/" className="admin-view-store">
            <Store size={17} />
            Voir le site
          </Link>
        </header>

        <section className="admin-welcome">
          <div>
            <span className="admin-welcome-tag">TON ESPACE DE GESTION</span>
            <h2>Bienvenue dans ta boutique.</h2>
            <p>
              Gère tes produits, surveille ton stock et garde ta boutique
              organisée.
            </p>
          </div>
          <div className="admin-welcome-art" aria-hidden="true">
            <ShoppingBag size={70} strokeWidth={1.1} />
          </div>
        </section>

        <section className="admin-stats">
          <article className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Total des produits</span>
              <span className="admin-stat-icon violet">
                <Package size={20} />
              </span>
            </div>
            <strong>{products.length}</strong>
            <p>Articles dans ta boutique</p>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Stock disponible</span>
              <span className="admin-stat-icon green">
                <Boxes size={20} />
              </span>
            </div>
            <strong>{totalStock}</strong>
            <p>Unités en stock</p>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Valeur du stock</span>
              <span className="admin-stat-icon gold">
                <ShoppingBag size={20} />
              </span>
            </div>
            <strong className="admin-stat-price">
              {formatPrice(inventoryValue)}
            </strong>
            <p>Prix × quantité en stock</p>
          </article>
        </section>

        {notice && (
          <div className="admin-notice" role="status">
            <CheckCircle2 size={18} />
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Fermer le message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="admin-content-grid">
          <section className="admin-panel admin-add-panel" id="ajouter">
            <div className="admin-panel-heading">
              <div>
                <span className="admin-section-kicker">
                  {editingId !== null ? "MODIFICATION" : "CATALOGUE"}
                </span>
                <h2>
                  {editingId !== null
                    ? "Modifier le produit"
                    : "Ajouter un produit"}
                </h2>
              </div>

              <span className="admin-heading-icon">
                {editingId !== null ? (
                  <Pencil size={20} />
                ) : (
                  <Plus size={20} />
                )}
              </span>
            </div>

            <form className="admin-product-form" onSubmit={handleSubmit}>
              <label>
                Nom du produit
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ex. Parfum Oud Royal"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Catégorie
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <div className="admin-form-two-cols">
                <label>
                  Prix (FCFA)
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    placeholder="15000"
                    required
                  />
                </label>

                <label>
                  Quantité
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={stock}
                    onChange={(event) => setStock(event.target.value)}
                    placeholder="10"
                    required
                  />
                </label>
              </div>

              <div className="admin-upload-group">
                <span className="admin-field-label">Photo du produit</span>

                <label className="admin-upload-zone" htmlFor="admin-product-image">
                  {image ? (
                    <img src={image} alt="Aperçu du produit" />
                  ) : (
                    <>
                      <span className="admin-upload-icon">
                        <ImagePlus size={24} />
                      </span>
                      <strong>Ajouter une photo</strong>
                      <span>PNG, JPG ou WEBP · 3 Mo maximum</span>
                    </>
                  )}

                  <input
                    id="admin-product-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                  />
                </label>

                {image && (
                  <button
                    className="admin-remove-image"
                    type="button"
                    onClick={() => {
                      setImage("");
                      const fileInput = document.getElementById(
                        "admin-product-image"
                      );
                      if (fileInput) fileInput.value = "";
                    }}
                  >
                    <Trash2 size={14} /> Retirer la photo
                  </button>
                )}
              </div>

              <button className="admin-submit-button" type="submit">
                {editingId !== null ? (
                  <Pencil size={18} />
                ) : (
                  <Plus size={18} />
                )}
                {editingId !== null
                  ? "Enregistrer les modifications"
                  : "Ajouter à la boutique"}
              </button>

              {editingId !== null && (
                <button
                  className="admin-cancel-edit"
                  type="button"
                  onClick={cancelEditing}
                >
                  <X size={17} />
                  Annuler la modification
                </button>
              )}
            </form>
          </section>

          <section
            className="admin-panel admin-inventory-panel"
            id="inventaire"
          >
            <div className="admin-panel-heading admin-inventory-heading">
              <div>
                <span className="admin-section-kicker">TES ARTICLES</span>
                <h2>Inventaire</h2>
                <p>{products.length} produit(s) enregistré(s)</p>
              </div>
              <span className="admin-inventory-count">{products.length}</span>
            </div>

            <div className="admin-search-box">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un produit..."
                aria-label="Rechercher un produit"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Effacer la recherche"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="admin-empty-state">
                <span>
                  <Package size={30} />
                </span>
                <h3>
                  {search ? "Aucun résultat" : "Ton inventaire est vide"}
                </h3>
                <p>
                  {search
                    ? "Essaie un autre nom ou une autre catégorie."
                    : "Ajoute ton premier produit avec le formulaire."}
                </p>
              </div>
            ) : (
              <div className="admin-product-list">
                {filteredProducts.map((product) => (
                  <article
                    className="admin-inventory-item"
                    key={product.id}
                  >
                    <div className="admin-item-image">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name || "Produit"}
                        />
                      ) : (
                        <Package size={24} />
                      )}
                    </div>

                    <div className="admin-item-details">
                      <span className="admin-item-category">
                        {product.category || "Sans catégorie"}
                      </span>
                      <h3>{product.name || "Produit sans nom"}</h3>
                      <strong>{formatPrice(product.price)}</strong>

                      <span
                        className={`admin-stock-status ${
                          Number(product.stock) === 0
                            ? "out-of-stock"
                            : Number(product.stock) <= 5
                              ? "low-stock"
                              : "in-stock"
                        }`}
                      >
                        {Number(product.stock) === 0
                          ? "Rupture de stock"
                          : Number(product.stock) <= 5
                            ? `Stock faible · ${product.stock}`
                            : `En stock · ${product.stock}`}
                      </span>
                    </div>

                    <div className="admin-item-actions">
                      <button
                        type="button"
                        className="admin-edit-button"
                        onClick={() => startEditing(product)}
                        aria-label={`Modifier ${product.name || "ce produit"}`}
                        title="Modifier le produit"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        className="admin-delete-button"
                        onClick={() => deleteProduct(product.id)}
                        aria-label={`Supprimer ${product.name || "ce produit"}`}
                        title="Supprimer le produit"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <footer className="admin-footer">
          <span>SADIKHSHOP</span>
          <span>Gestion de ta boutique en toute simplicité.</span>
        </footer>
      </main>
    </div>
  );
}
