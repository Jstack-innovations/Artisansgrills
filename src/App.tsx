import { useState, useEffect, useRef } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUtensils, faBurger,
  faEarthAfrica,
  faBowlRice,
  faIceCream } from "@fortawesome/free-solid-svg-icons";
  import { faInstagram, faFacebookF, faTwitter, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import CartSidebar from "./Components/CartSidebar";
import MenuModal from "./Components/MenuModal";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "./Config/api";

/* ================= API ================= */

const ApiService = {
  async getMenu() {
    const res = await fetch(
              `${API_BASE}/menu`
    );
    return await res.json();
  }
};

/* ================= Typing ================= */

function useTyping(text = "") {

  const [typingText, setTypingText] = useState("");

  const indexRef = useRef(0);
  const deletingRef = useRef(false);
  const pauseRef = useRef(false);

  useEffect(() => {

    const interval = setInterval(() => {

      const index = indexRef.current;
      const deleting = deletingRef.current;
      const pause = pauseRef.current;

      // ✅ Typing phase
      if (!deleting && !pause) {

        setTypingText(text.substring(0, index));

        if (index < text.length) {
          indexRef.current++;
        } else {
          // ⭐ Finished typing → Pause before deleting
          pauseRef.current = true;

          setTimeout(() => {
            pauseRef.current = false;
            deletingRef.current = true;
          }, 2000); // ⭐ Pause after typing (2 seconds)
        }

      }

      // ✅ Deleting phase
      else if (deleting) {

        setTypingText(text.substring(0, index));

        if (index > 0) {
          indexRef.current--;
        } else {
          deletingRef.current = false;
          indexRef.current = 0;
        }

      }

    }, 120); // ⭐ Typing speed (lower = faster)

    return () => clearInterval(interval);

  }, [text]);

  return typingText;
}

/* ================= Header ================= */

function Header({ cart, setCartOpen }) {

  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate(); // ⭐ Add this

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 80);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "sticky" : ""}`}>
      <div className="nav-container">

        <div className="logo">
          <FontAwesomeIcon icon={faUtensils} />
          ARTISAN <span>GRILL</span>
        </div>

        <div className="nav-actions">

          <button
            className="cart-btn"
            onClick={() => setCartOpen(true)}
          >
            <FontAwesomeIcon icon={faShoppingCart} />
            GUEST's ORDER
            <span className="cart-count">{cart.length}</span>
          </button>

          {/* ⭐ Replace window.location */}
          <button
            className="btn-reserve"
            onClick={() => navigate("/reservations")}
          >
            RESERVE TABLE
          </button>

        </div>
      </div>
    </header>
  );
}

/* ================= Hero ================= */

function Hero({ typingText }) {

  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="hero">

      <h1>
        ARTISAN <span>MENU</span>
      </h1>

      <p>
        {typingText}

        <span
          className="hero-cursor"
          style={{ opacity: showCursor ? 1 : 0 }}
        />
      </p>

    </div>
  );
}

/* ================= Category Filter ================= */

function CategoryFilter({ activeFilter, setActiveFilter }) {

  const cats = [
    { name: "all", icon: faEarthAfrica },
    { name: "appetizers", icon: faBurger },
    { name: "main", icon: faUtensils },
    { name: "regional", icon: faBowlRice },
    { name: "continental", icon: faUtensils },
    { name: "desserts", icon: faIceCream }
  ];

  return (
    <div className="category-filter">
      {cats.map(cat => (
        <button
          key={cat.name}
          onClick={() => setActiveFilter(cat.name)}
          className={`category-btn ${
            activeFilter === cat.name ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={cat.icon} />
          {cat.name.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/* ================= Menu Grid ================= */

function MenuGrid({ menuData, activeFilter, addToCart, setModalCategory }) {
  
  const [addedItems, setAddedItems] = useState([]);
  
  return (
    <section className="section">
      <div className="menu-grid">

        {menuData && Object.keys(menuData).map(cat => {

          if (activeFilter !== "all" && activeFilter !== cat) return null;

          return (
            <div key={cat} className="menu-category">

              <div className="menu-category-header">
  <h2 className="menu-category-title">
    {cat.toUpperCase()}
  </h2>

  <span className="menu-category-count">
    {menuData[cat]?.length || 0} items
  </span>
</div>

              <div className="menu-items">

                {menuData[cat]?.slice(0, 2).map(item => (
                  <div
  key={item.id}
  className={`menu-card ${item.stock === 0 ? "sold-out" : ""}`}
>

                    {/* Image */}
                    <div className="menu-image-wrapper">
                      <img src={item.image} className="menu-image" />

                      {item.stock === 0 && (
  <div className="sold-overlay">
    OUT OF STOCK
  </div>
)}

                      {/* Tags */}
                      {item.tags && (
                        <div className="menu-tags">
                          {item.tags.map(tag => (
                            <span key={tag} className="tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                    </div>

                    {/* Content */}
                    <div className="menu-card-content">

                      <h3 className="menu-item-name">
                        {item.name}
                      </h3>

                      <p className="menu-item-desc">
                        {item.description}
                      </p>

                      {/* Signature */}
                      {item.signature && (
                        <div className="menu-signature">
                          ✨ {item.signature}
                        </div>
                      )}
<div className="menu-footer">

  <b className="menu-price">
    ₦{item.price}
  </b>

  <div className="stock-info">
    {item.stock > 0 ? (
      <span className="in-stock">
        Plates Available: {item.stock}
      </span>
    ) : (
      <span className="out-stock">
        Out of Stock
      </span>
    )}
  </div>

  <button
    className={`add-order-btn ${
      addedItems.includes(item.id) ? "added" : ""
    }`}
    disabled={item.stock === 0}
    onClick={() => {
      addToCart(item);

      setAddedItems(prev => [...prev, item.id]);

      setTimeout(() => {
        setAddedItems(prev =>
          prev.filter(id => id !== item.id)
        );
      }, 2500);
    }}
  >
    {item.stock === 0
      ? "OUT OF STOCK"
      : addedItems.includes(item.id)
      ? "✓ ORDER ADDED"
      : "ADD ORDER"}
  </button>

</div>
                    </div>
                  </div>
                ))}

              </div>
              
<div className="view-more-wrapper">
  <button
    type="button"
    className="view-more-btn"
    onClick={() => setModalCategory(cat)}
  >
    VIEW MORE ({Math.max((menuData[cat]?.length || 0) - 2, 0)})
  </button>
</div>

            </div>
          );

        })}

      </div>
    </section>
  );
}

/* ================= MAIN APP ================= */

export default function MenuApp() {

  const [menuData, setMenuData] = useState({});
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [modalCategory, setModalCategory] = useState(null);
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    ApiService.getMenu().then(setMenuData);
  }, []);
  
  
  
  useEffect(() => {
  // show ad after 6 seconds
  const showTimer = setTimeout(() => {
    setShowAd(true);
  }, 3000);

  // auto close after 20 seconds
  const closeTimer = setTimeout(() => {
    setShowAd(false);
  }, 26000);

  return () => {
    clearTimeout(showTimer);
    clearTimeout(closeTimer);
  };

}, []);




  const typingText = useTyping(
    "Explore our curated selection of regional specialties and continental masterpieces, crafted with premium ingredients and traditional techniques."
  );

  /* ⭐ CART LOGIC */
  function addToCart(item) {
    setCart(prev => {
      const found = prev.find(i => i.id === item.id);

      if (found) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: (i.quantity || 1) + 1 }
            : i
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  }

  /* ⭐ QUANTITY UPDATE */
  function updateQty(id, value) {
  setCart(prev => {
    if (value === 0) {
      // ⭐ Real delete item
      return prev.filter(item => item.id !== id);
    }

    return prev.map(item =>
      item.id === id
        ? {
            ...item,
            quantity: Math.max(1, (item.quantity || 1) + value)
          }
        : item
    );
  });
}

  const subtotal = cart.reduce(
    (s, i) => s + i.price * (i.quantity || 1),
    0
  );

  return (
    <div style={{ background: "#0f0c0a", minHeight: "100vh" }}>

<Header cart={cart} setCartOpen={setCartOpen} />

      <Hero typingText={typingText} />

      <CategoryFilter
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
      
      {/* ⭐ This is the new section */}
<section className="section" id="menu">
    <div className="section-header">
        <h2 className="section-title">
            Premium Dining Experience
        </h2>

        <p className="section-subtitle">
            Each dish tells a story of tradition, craftsmanship, and culinary excellence
        </p>
    </div>
</section>

      <MenuGrid
  menuData={menuData}
  activeFilter={activeFilter}
  addToCart={addToCart}
  setModalCategory={setModalCategory}
/>

<MenuModal
  category={modalCategory}
  items={modalCategory ? menuData[modalCategory] : []}
  onClose={() => setModalCategory(null)}
  addToCart={addToCart}
  setPreviewItem={() => {}}
/>

      <CartSidebar
        cart={cart}
        subtotal={subtotal}
        taxAmount={0}
        totalAmount={subtotal}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        updateQty={updateQty}
        checkout={(data) => console.log(data)}
      />
      
      
      
      
      
      {showAd && (
  <div className="ad-banner ad-slide">
    <div className="ad-content">

      <video
        className="ad-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src="https://jstack-sigma.vercel.app/artisangrill/menuads.mp4"
          type="video/mp4"
        />
      </video>

      <div className="ad-text">
        <h3>Premium Dining Experience</h3>
        <p>
          Discover the best dishes in town — fresh, modern,
          delicious.
        </p>

        <a href="#menu" className="ad-btn">
          View Menu
        </a>
      </div>

      <b
        className="ad-close"
        onClick={() => setShowAd(false)}
      >
        ✕
      </b>

    </div>
  </div>
)}





<footer className="footer">
  <div className="footer-grid">

    <div className="footer-column">
      <h3>Artisan Grill Collective</h3>
      <p>
        Redefining premium dining through innovation, sustainability, and exceptional hospitality since 2008.
      </p>
      <div className="social-icons">
        <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
        <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
        <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
        <a href="#"><FontAwesomeIcon icon={faLinkedinIn} /></a>
      </div>
    </div>

    <div className="footer-column">
      <h3>Quick Links</h3>
      <ul className="footer-links">
        <li><a href="#menu">Menu</a></li>
        <li><a href="#locations">Locations</a></li>
        <li><a href="#about">Our Story</a></li>
        <li><a href="#careers">Careers</a></li>
        <li><a href="#contact">Contact Us</a></li>
      </ul>
    </div>

    <div className="footer-column">
      <h3>Legal</h3>
      <ul className="footer-links">
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Terms of Service</a></li>
        <li><a href="#">Cookie Policy</a></li>
        <li><a href="#">Accessibility</a></li>
        <li><a href="#">Nutrition Information</a></li>
      </ul>
    </div>

    <div className="footer-column">
      <h3>Corporate</h3>
      <ul className="footer-links">
        <li><a href="#">Investor Relations</a></li>
        <li><a href="#">Franchise Information</a></li>
        <li><a href="#">Supplier Portal</a></li>
        <li><a href="#">Sustainability Report</a></li>
        <li><a href="#">Press Center</a></li>
      </ul>
    </div>

  </div>

  <div className="copyright">
    <p>
      &copy; 2023 Artisan Grill Collective. All rights reserved. Liscenced by the Federal Government.
    </p>
  </div>
</footer>






    </div>
  );
}
