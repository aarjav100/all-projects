import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ShoppingBag, User, Moon, Sun, ShieldCheck, Scale, Search,
  Heart, SlidersHorizontal, ArrowRight, ChevronRight, Grid, List, Star,
  Mic, Plus, Minus, Trash2, X, Check, ChevronDown, Package, BarChart3,
  Gift, Award, TrendingUp, CreditCard, RefreshCw, Mail, Phone, MapPin,
  Instagram, Twitter, Facebook, Youtube, Crown, Zap, Eye, Share2,
  ChevronLeft, Filter, Tag, Clock, Shield, Truck, RotateCcw, Gem
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
//  PRODUCT DATA
// ─────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1, name: "MacBook Air M3", brand: "Apple", category: "LAPTOPS",
    price: 114900, rating: 4.8, reviews: 2847, image: "💻", stock: 12,
    badge: "Best Seller", color: "#1d1d1f",
    description: "The ultimate thin-and-light with the power of M3. Fanless design, 18-hour battery, 15.3-inch Liquid Retina display.",
    specs: {
      "Processor": "Apple M3 (8-core CPU, 10-core GPU)", "Display": "15.3-inch Liquid Retina (500 nits)",
      "Battery Life": "Up to 18 hours", "Weight": "1.51 kg",
      "Material": "100% Recycled Aluminum", "Key Advantage": "Silent fanless design & maximum efficiency"
    }
  },
  {
    id: 2, name: "Galaxy S25 Ultra", brand: "Samsung", category: "MOBILES",
    price: 129999, rating: 4.7, reviews: 1923, image: "📱", stock: 8,
    badge: "New Arrival", color: "#1a1a2e",
    description: "The most powerful Galaxy ever. Built-in S Pen, 200MP camera system, Snapdragon 8 Gen 4 for Galaxy.",
    specs: {
      "Processor": "Snapdragon 8 Gen 4 for Galaxy", "Display": "6.8-inch Dynamic AMOLED 2X (120Hz)",
      "Battery Life": "Up to 26 hours active use", "Weight": "232 g",
      "Material": "Titanium Casing & Gorilla Glass Armor", "Key Advantage": "Built-in S-Pen & 200MP cinematic zoom"
    }
  },
  {
    id: 3, name: "Nike Air Max 270", brand: "Nike", category: "FOOTWEAR",
    price: 12995, rating: 4.5, reviews: 4211, image: "👟", stock: 25,
    badge: "Trending", color: "#ff6b35",
    description: "Max Air cushioning for all-day comfort. Breathable upper mesh, bold styling that stands out.",
    specs: {
      "Sole": "Responsive Dual-density Foam", "Upper": "Breathable Engineered Knit",
      "Durability": "Lifetime Rating", "Weight": "270 g",
      "Material": "Recycled Canvas & Air-Sole Unit", "Key Advantage": "Maximum impact absorption"
    }
  },
  {
    id: 4, name: "Sony WH-1000XM6", brand: "Sony", category: "AUDIO",
    price: 29990, rating: 4.9, reviews: 3456, image: "🎧", stock: 15,
    badge: "Award Winning", color: "#0a0a0a",
    description: "Industry-leading noise cancellation meets 45-hour battery life. Multipoint Bluetooth for seamless switching.",
    specs: {
      "Chipset": "Sony V2 Noise Cancelling", "Controls": "Tactile Smart Sensor Cups",
      "Battery Life": "Up to 45 hours (ANC Active)", "Weight": "245 g",
      "Material": "Ultra-soft Alcantara Cushioning", "Key Advantage": "Industry-leading Smart Noise Cancellation"
    }
  },
  {
    id: 5, name: "Dell XPS 15", brand: "Dell", category: "LAPTOPS",
    price: 189000, rating: 4.6, reviews: 987, image: "💻", stock: 6,
    badge: "Premium", color: "#2c2c2c",
    description: "The ultimate creative powerhouse. 3.5K OLED touchscreen, Intel Core i9 14th Gen, stunning CinemaColor display.",
    specs: {
      "Processor": "Intel Core i9 14th Gen Ultra", "Display": "15.6-inch 3.5K OLED Touchscreen",
      "Battery Life": "Up to 11 hours", "Weight": "1.86 kg",
      "Material": "CNC Aluminum & Carbon Fiber", "Key Advantage": "CinemaColor screen & elite creative workflow"
    }
  },
  {
    id: 6, name: "iPhone 16 Pro", brand: "Apple", category: "MOBILES",
    price: 134900, rating: 4.8, reviews: 5623, image: "📱", stock: 14,
    badge: "Editor's Pick", color: "#f5f0e8",
    description: "Titanium. So strong. So light. So Pro. Camera Control, A18 Pro chip, and 5x optical zoom.",
    specs: {
      "Processor": "Apple A18 Pro Bionic (3nm)", "Display": "6.3-inch Super Retina XDR (ProMotion)",
      "Battery Life": "Up to 23 hours playback", "Weight": "199 g",
      "Material": "Grade 5 Brushed Titanium", "Key Advantage": "Pro Camera Control button & Spatial Video"
    }
  },
  {
    id: 7, name: "Adidas Ultraboost 24", brand: "Adidas", category: "FOOTWEAR",
    price: 17999, rating: 4.4, reviews: 2134, image: "👟", stock: 18,
    badge: "Eco-Friendly", color: "#3d3d3d",
    description: "Made from ocean plastic, powered by Boost technology. Maximum energy return every single stride.",
    specs: {
      "Foam": "High-Energy Return Boost", "Support": "Primeknit+ Elastic",
      "Durability": "400+ Mile Guarantee", "Weight": "290 g",
      "Material": "Parley Ocean Plastic Fibers", "Key Advantage": "Propulsive energy push & comfort"
    }
  },
  {
    id: 8, name: "HP Spectre x360", brand: "HP", category: "LAPTOPS",
    price: 159999, rating: 4.5, reviews: 743, image: "💻", stock: 10,
    badge: "Convertible", color: "#2d2d4a",
    description: "2-in-1 with Gem-cut design. 360-degree hinge, OLED display, Intel Core Ultra with AI capabilities.",
    specs: {
      "Processor": "Intel Core Ultra 7 155H", "Display": "14-inch 2.8K 120Hz Flip OLED",
      "Battery Life": "Up to 15 hours", "Weight": "1.44 kg",
      "Material": "Precision Cut Gem-cut Aluminum", "Key Advantage": "360-degree hinge & digital stylus"
    }
  },
  {
    id: 9, name: "OnePlus 13", brand: "OnePlus", category: "MOBILES",
    price: 69999, rating: 4.6, reviews: 1876, image: "📱", stock: 22,
    badge: "Value Pick", color: "#cc0000",
    description: "Flagship performance at accessible pricing. 100W warp charging, Hasselblad camera tuning, incredible display.",
    specs: {
      "Processor": "Snapdragon 8 Gen 4 Octa-core", "Display": "6.82-inch BOE X2 Quad-curved",
      "Battery Life": "Up to 30 hours", "Weight": "213 g",
      "Material": "Hasselblad Glass Ceramic Backing", "Key Advantage": "100W wired & 50W wireless charging"
    }
  },
  {
    id: 10, name: "Puma RS-X3", brand: "Puma", category: "FOOTWEAR",
    price: 8999, rating: 4.2, reviews: 3298, image: "👟", stock: 30,
    badge: "Street Style", color: "#e74c3c",
    description: "Bold chunky retro silhouette with massive cushioning. Suede overlays and vulcanized rubber outsole.",
    specs: {
      "Sole": "Shock-absorbing PU Midsole", "Upper": "Multi-layered Suede Overlays",
      "Durability": "Heavy Wear Rating", "Weight": "310 g",
      "Material": "High-grip Vulc Rubber Outsole", "Key Advantage": "Retro aesthetics & chunky profiles"
    }
  },
  {
    id: 11, name: "Samsung Galaxy Tab S10", brand: "Samsung", category: "MOBILES",
    price: 89999, rating: 4.5, reviews: 1092, image: "📱", stock: 11,
    badge: "Productivity", color: "#1a1a2e",
    description: "The ultimate creative canvas. 12.4-inch Dynamic AMOLED, DeX mode, S Pen included, IP68 rated.",
    specs: {
      "Processor": "MediaTek Dimensity 9300+", "Display": "12.4-inch Dynamic AMOLED 2X",
      "Battery Life": "Up to 16 hours", "Weight": "571 g",
      "Material": "Armor Aluminum Back Shield", "Key Advantage": "IP68 & massive creative canvas"
    }
  },
  {
    id: 12, name: "Asus ROG Zephyrus G16", brand: "Asus", category: "LAPTOPS",
    price: 199999, rating: 4.7, reviews: 634, image: "💻", stock: 5,
    badge: "Gaming Pro", color: "#00d4aa",
    description: "Elite gaming in an ultra-thin chassis. 240Hz OLED panel, RTX 4070, ROG Slash LED lighting system.",
    specs: {
      "Processor": "Ryzen 9 8945HS & RTX 4070", "Display": "16-inch ROG Nebula OLED (240Hz)",
      "Battery Life": "Up to 9 hours", "Weight": "1.85 kg",
      "Material": "CNC Anodized Aluminum + Slash Lighting", "Key Advantage": "Extreme gaming & ultra-thin build"
    }
  }
];

const CATEGORIES = [
  { id: 'ALL', label: 'All', icon: '✦', count: PRODUCTS.length },
  { id: 'LAPTOPS', label: 'Laptops', icon: '💻', count: PRODUCTS.filter(p => p.category === 'LAPTOPS').length },
  { id: 'MOBILES', label: 'Mobiles', icon: '📱', count: PRODUCTS.filter(p => p.category === 'MOBILES').length },
  { id: 'FOOTWEAR', label: 'Footwear', icon: '👟', count: PRODUCTS.filter(p => p.category === 'FOOTWEAR').length },
  { id: 'AUDIO', label: 'Audio', icon: '🎧', count: PRODUCTS.filter(p => p.category === 'AUDIO').length },
];

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Dell', 'HP', 'OnePlus', 'Puma', 'Asus'];

const GOLD = '#c9a84c';
const GOLD_DARK = '#a8893d';

// ─────────────────────────────────────────────────────────────
//  HELPER COMPONENTS
// ─────────────────────────────────────────────────────────────
const StarRating = ({ rating, size = 12 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} size={size} style={{ color: s <= Math.round(rating) ? GOLD : '#d1d5db', fill: s <= Math.round(rating) ? GOLD : 'none' }} />
    ))}
  </div>
);

const GoldBadge = ({ text }) => (
  <span style={{ background: 'rgba(201,168,76,0.1)', color: GOLD, border: `1px solid rgba(201,168,76,0.25)` }}
    className="px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-[0.15em]">
    {text}
  </span>
);

const LuxeButton = ({ children, onClick, variant = 'gold', size = 'md', className = '', disabled = false, type = 'button' }) => {
  const base = "inline-flex items-center justify-center gap-2 font-black uppercase tracking-widest transition-all duration-200 active:scale-[0.98] disabled:opacity-50";
  const sizes = { sm: 'text-[9px] py-2 px-4 rounded-lg', md: 'text-[10px] py-3 px-6 rounded-xl', lg: 'text-xs py-4 px-8 rounded-2xl', full: 'text-xs py-4 rounded-2xl w-full' };
  const variants = {
    gold: `bg-[${GOLD}] hover:bg-[${GOLD_DARK}] text-white shadow-lg hover:shadow-xl`,
    dark: 'bg-[#0a0a0a] hover:bg-[#1a1a1a] text-white shadow-lg hover:shadow-xl',
    outline: 'border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-white',
    ghost: 'text-stone-500 hover:text-black dark:hover:text-white',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      style={variant === 'gold' ? { background: GOLD } : {}}>
      {children}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('home');
  const [theme, setTheme] = useState(() => localStorage.getItem('luxe_theme') || 'light');

  // Filters
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchVal, setSearchVal] = useState('');
  const [viewType, setViewType] = useState('grid');
  const [priceRange, setPriceRange] = useState(200000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState('featured');
  const [showFilters, setShowFilters] = useState(true);

  // Cart
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('luxe_cart') || '[]'); } catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedId, setAddedId] = useState(null);

  // Wishlist
  const [wishlist, setWishlist] = useState([]);

  // Compare
  const [compareItems, setCompareItems] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  // Budget
  const [budgetVal, setBudgetVal] = useState('');
  const [budgetResult, setBudgetResult] = useState(null);

  // AI Search
  const [isListening, setIsListening] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Modals & Overlays
  const [toast, setToast] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [user, setUser] = useState(null);

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Admin form
  const [adminForm, setAdminForm] = useState({ name: '', price: '', category: 'LAPTOPS', stock: '10', description: '' });
  const [adminSuccess, setAdminSuccess] = useState('');

  // Auth form
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });

  // Persist
  useEffect(() => { localStorage.setItem('luxe_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('luxe_theme', theme); }, [theme]);

  // Load fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=DM+Sans:ital,opsz,wght@0,9..40,300..800;1,9..40,300..800&display=swap';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const isDark = theme === 'dark';

  // ── TOAST ──────────────────────────────────────────────────
  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── CART ACTIONS ───────────────────────────────────────────
  const addToCart = (product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setAddedId(product.id);
    showToast(`${product.name} added to your Luxe Bag ✓`);
    setTimeout(() => setAddedId(null), 1600);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
    showToast('Item removed from bag');
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // ── WISHLIST ───────────────────────────────────────────────
  const toggleWishlist = (id) => {
    setWishlist(prev => {
      if (prev.includes(id)) { showToast('Removed from wishlist'); return prev.filter(i => i !== id); }
      showToast('Saved to your wishlist ♥'); return [...prev, id];
    });
  };

  // ── COMPARE ────────────────────────────────────────────────
  const toggleCompare = (product) => {
    setCompareItems(prev => {
      if (prev.find(i => i.id === product.id)) return prev.filter(i => i.id !== product.id);
      if (prev.length >= 3) { showToast('Compare limit is 3 products max.', 'warn'); return prev; }
      return [...prev, product];
    });
  };

  // ── AI SEARCH ──────────────────────────────────────────────
  const handleAiSearch = (e) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      const q = searchVal.toLowerCase();
      let cat = null;
      if (q.includes('laptop') || q.includes('macbook') || q.includes('computer')) cat = 'LAPTOPS';
      else if (q.includes('phone') || q.includes('mobile') || q.includes('galaxy') || q.includes('iphone')) cat = 'MOBILES';
      else if (q.includes('shoe') || q.includes('sneaker') || q.includes('boot') || q.includes('run')) cat = 'FOOTWEAR';
      else if (q.includes('headphone') || q.includes('audio') || q.includes('sony') || q.includes('earphone')) cat = 'AUDIO';
      if (cat) setActiveCategory(cat);
      setAiResponse({ query: searchVal, category: cat, count: cat ? PRODUCTS.filter(p => p.category === cat).length : PRODUCTS.length });
      setIsSearching(false);
      if (page === 'home') setPage('catalog');
    }, 900);
  };

  const handleMic = () => {
    if (isListening) return;
    setIsListening(true);
    setTimeout(() => {
      const queries = ["Show me gaming laptops under ₹2,00,000", "Find running shoes", "Show me premium Apple devices"];
      const q = queries[Math.floor(Math.random() * queries.length)];
      setSearchVal(q);
      setIsListening(false);
      showToast(`Voice: "${q}"`);
    }, 2000);
  };

  // ── BUDGET OPTIMIZER ───────────────────────────────────────
  const handleBudget = (e) => {
    e.preventDefault();
    const limit = Number(budgetVal);
    if (!limit || limit <= 0) { showToast('Enter a valid budget amount.', 'warn'); return; }
    showToast(`✦ AI optimizing for ₹${limit.toLocaleString()}...`);
    setTimeout(() => {
      let selected = [], total = 0;
      for (const p of [...PRODUCTS].sort((a, b) => b.rating - a.rating)) {
        if (total + p.price <= limit) { selected.push(p); total += p.price; }
      }
      if (!selected.length) {
        const cheapest = [...PRODUCTS].sort((a, b) => a.price - b.price)[0];
        if (cheapest.price <= limit + 5000) { selected.push(cheapest); total = cheapest.price; }
      }
      setBudgetResult({ items: selected, total, strategy: selected.length ? `Gemini selected ${selected.length} premium item${selected.length > 1 ? 's' : ''} maximizing rating & value within your ₹${limit.toLocaleString()} budget.` : 'Budget too limited. Try a higher limit for better options.' });
    }, 1200);
  };

  // ── FILTERED PRODUCTS ──────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let r = [...PRODUCTS];
    if (activeCategory !== 'ALL') r = r.filter(p => p.category === activeCategory);
    if (searchVal.trim() && !aiResponse) {
      const q = searchVal.toLowerCase();
      r = r.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    r = r.filter(p => p.price <= priceRange);
    if (selectedBrands.length) r = r.filter(p => selectedBrands.includes(p.brand));
    if (selectedRating) r = r.filter(p => p.rating >= selectedRating);
    if (inStockOnly) r = r.filter(p => p.stock > 0);
    if (sortOption === 'price-low') r.sort((a, b) => a.price - b.price);
    else if (sortOption === 'price-high') r.sort((a, b) => b.price - a.price);
    else if (sortOption === 'rating') r.sort((a, b) => b.rating - a.rating);
    else if (sortOption === 'reviews') r.sort((a, b) => b.reviews - a.reviews);
    return r;
  }, [activeCategory, searchVal, aiResponse, priceRange, selectedBrands, selectedRating, inStockOnly, sortOption]);

  const resetFilters = () => {
    setPriceRange(200000); setSelectedBrands([]); setSelectedRating(0);
    setInStockOnly(false); setSortOption('featured'); setSearchVal('');
    setAiResponse(null); setActiveCategory('ALL');
    showToast('All filters reset');
  };

  // ── AUTH ───────────────────────────────────────────────────
  const handleAuth = (e) => {
    e.preventDefault();
    if (authMode === 'signin') {
      setUser({ name: authForm.email.split('@')[0], email: authForm.email, role: authForm.email.includes('admin') ? 'admin' : 'user', points: 1250 });
      showToast(`Welcome back! Luxe Points: 1,250 ✦`);
    } else {
      setUser({ name: authForm.name, email: authForm.email, role: 'user', points: 100 });
      showToast(`Welcome to LUXE! 100 bonus points added ✦`);
    }
    setShowAuth(false);
    setAuthForm({ name: '', email: '', password: '' });
  };

  // ── ADMIN ──────────────────────────────────────────────────
  const handleAdminAdd = (e) => {
    e.preventDefault();
    setAdminSuccess('Product added to catalog successfully!');
    setAdminForm({ name: '', price: '', category: 'LAPTOPS', stock: '10', description: '' });
    setTimeout(() => setAdminSuccess(''), 3000);
  };

  // ── THEME STYLES ───────────────────────────────────────────
  const bg = isDark ? '#0a0a0a' : '#f5f0e8';
  const surface = isDark ? '#111111' : '#ffffff';
  const border = isDark ? '#1e1e1e' : '#e8e2d8';
  const text = isDark ? '#f5f0e8' : '#0a0a0a';
  const muted = isDark ? '#666666' : '#888888';

  // ─────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <div style={{ background: bg, color: text, fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', transition: 'background 0.4s, color 0.4s' }}>

      {/* ══════════════════════════════════════════════════════
           NAVBAR
          ══════════════════════════════════════════════════════ */}
      <nav style={{ background: isDark ? 'rgba(10,10,10,0.97)' : 'rgba(245,240,232,0.97)', borderBottom: `1px solid ${border}` }}
        className="sticky top-0 z-40 px-6 md:px-12 py-4 flex items-center justify-between backdrop-blur-xl">

        {/* Logo */}
        <button onClick={() => setPage('home')}
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-2xl font-bold tracking-wider hover:opacity-80 transition-opacity">
          LUXE<span style={{ color: GOLD }}>.</span>
        </button>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.18em]">
          {['home', 'catalog'].map(p => (
            <button key={p} onClick={() => setPage(p)}
              style={{ color: page === p ? GOLD : muted, borderBottom: page === p ? `2px solid ${GOLD}` : '2px solid transparent' }}
              className="pb-0.5 transition-all hover:opacity-100">
              {p}
            </button>
          ))}
          {user && (
            <>
              <button onClick={() => setPage('profile')}
                style={{ color: page === 'profile' ? GOLD : muted, borderBottom: page === 'profile' ? `2px solid ${GOLD}` : '2px solid transparent' }}
                className="pb-0.5 transition-all">Profile</button>
              {user.role === 'admin' && (
                <button onClick={() => setPage('admin')}
                  style={{ color: page === 'admin' ? GOLD : muted, borderBottom: page === 'admin' ? `2px solid ${GOLD}` : '2px solid transparent' }}
                  className="pb-0.5 transition-all">Admin</button>
              )}
            </>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <button onClick={() => setTheme(isDark ? 'light' : 'dark')}
            style={{ border: `1px solid ${border}` }}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-all">
            {isDark ? <Sun size={14} style={{ color: GOLD }} /> : <Moon size={14} color={muted} />}
          </button>

          <button onClick={() => setIsCartOpen(true)} className="relative w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-all"
            style={{ border: `1px solid ${border}` }}>
            <ShoppingBag size={15} />
            {cartCount > 0 && (
              <span style={{ background: GOLD }}
                className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full text-[8px] font-black text-white flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <button onClick={() => setPage('profile')}
              style={{ background: GOLD }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black">
              {user.name[0].toUpperCase()}
            </button>
          ) : (
            <button onClick={() => setShowAuth(true)}
              style={{ background: '#0a0a0a', color: '#f5f0e8' }}
              className="px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all">
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════
           PAGE ROUTER
          ══════════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {/* ────── HOME PAGE ────── */}
        {page === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

            {/* HERO SECTION */}
            <section className="relative overflow-hidden" style={{ background: '#0a0a0a', minHeight: '92vh' }}>
              {/* Ambient glow */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,168,76,0.18) 0%, transparent 70%)' }} />
              <div className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
                style={{ background: GOLD }} />
              <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full opacity-5 blur-3xl pointer-events-none"
                style={{ background: '#6366f1' }} />

              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

              <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center py-28 gap-10">

                {/* Badge */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] py-2 px-5 rounded-full"
                    style={{ color: GOLD, background: 'rgba(201,168,76,0.08)', border: `1px solid rgba(201,168,76,0.2)` }}>
                    <Zap size={10} style={{ color: GOLD }} /> Next-Generation Shopping
                  </span>
                </motion.div>

                {/* H1 */}
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  style={{ fontFamily: "'Playfair Display', serif", color: '#f5f0e8', lineHeight: 1.1 }}
                  className="text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight max-w-4xl">
                  Intelligent Luxury,<br />
                  <em style={{ color: GOLD }}>Curated</em> For You.
                </motion.h1>

                {/* Subtext */}
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="text-sm md:text-base max-w-xl leading-relaxed"
                  style={{ color: '#888888', fontWeight: 400 }}>
                  Search naturally, compare models using AI, and earn premium Luxe Points with every purchase.
                </motion.p>

                {/* Search */}
                <motion.form onSubmit={handleAiSearch} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
                  <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2" size={15} style={{ color: '#555' }} />
                    <input type="text" placeholder="Try: 'Gaming laptops under ₹2,00,000'" value={searchVal}
                      onChange={e => { setSearchVal(e.target.value); if (aiResponse) setAiResponse(null); }}
                      className="w-full py-4.5 pl-12 pr-12 rounded-2xl text-sm font-medium focus:outline-none transition-all"
                      style={{ background: '#161616', border: '1px solid #2a2a2a', color: '#f5f0e8', caretColor: GOLD }}
                      onFocus={e => e.target.style.borderColor = GOLD}
                      onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
                    {searchVal && (
                      <button type="button" onClick={() => { setSearchVal(''); setAiResponse(null); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white transition-colors">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button type="submit" disabled={isSearching}
                      style={{ background: GOLD }}
                      className="flex items-center gap-2 px-8 py-4.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:opacity-90 transition-all active:scale-[0.98] shadow-lg disabled:opacity-60">
                      {isSearching ? '✦ Analyzing...' : <><Sparkles size={13} /> Ask AI</>}
                    </button>
                    <button type="button" onClick={handleMic}
                      style={{ border: `1px solid ${isListening ? '#ef4444' : '#2a2a2a'}`, color: isListening ? '#ef4444' : GOLD, background: isListening ? 'rgba(239,68,68,0.08)' : '#161616' }}
                      className="w-14 rounded-2xl flex items-center justify-center transition-all relative">
                      {isListening && <span className="absolute inset-0 rounded-2xl border-2 border-red-500 animate-ping opacity-40" />}
                      <Mic size={16} />
                    </button>
                  </div>
                </motion.form>

                {/* AI Response */}
                <AnimatePresence>
                  {aiResponse && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="w-full max-w-2xl rounded-2xl p-5 text-left"
                      style={{ background: '#111', border: `1px solid rgba(201,168,76,0.2)` }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Sparkles size={13} style={{ color: GOLD }} />
                          <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: GOLD }}>Luxe AI Verdict</span>
                        </div>
                        <button onClick={() => { setAiResponse(null); setSearchVal(''); }} style={{ color: muted }}>
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-xs font-medium" style={{ color: '#ccc', lineHeight: 1.6 }}>
                        Found <strong style={{ color: GOLD }}>{aiResponse.count}</strong> premium products
                        {aiResponse.category ? ` in ${aiResponse.category}` : ''} matching <em>"{aiResponse.query}"</em>.
                        Navigating to catalog now.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Stats bar */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                  className="flex items-center gap-8 mt-4">
                  {[['10,000+', 'Luxury Products'], ['4.9★', 'Average Rating'], ['₹0', 'Delivery Today'], ['24/7', 'AI Assistance']].map(([n, l]) => (
                    <div key={l} className="text-center">
                      <div className="text-lg font-black" style={{ color: GOLD, fontFamily: "'Playfair Display', serif" }}>{n}</div>
                      <div className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: '#555' }}>{l}</div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Scroll indicator */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
                <span className="text-[8px] uppercase tracking-widest" style={{ color: '#666' }}>Scroll to Explore</span>
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <ChevronDown size={16} style={{ color: '#666' }} />
                </motion.div>
              </div>
            </section>

            {/* FEATURED CATEGORIES */}
            <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-2" style={{ color: GOLD }}>Shop by Category</p>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', lineHeight: 1.1 }} className="font-normal">
                    Curated Collections
                  </h2>
                </div>
                <button onClick={() => setPage('catalog')} className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:opacity-70 transition-opacity" style={{ color: GOLD }}>
                  View All <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES.filter(c => c.id !== 'ALL').map((cat, i) => (
                  <motion.button key={cat.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    onClick={() => { setActiveCategory(cat.id); setPage('catalog'); }}
                    className="group relative overflow-hidden rounded-3xl p-8 text-left flex flex-col justify-between aspect-square hover:-translate-y-1 transition-all duration-300"
                    style={{ background: isDark ? '#111' : '#fff', border: `1px solid ${border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                    <div>
                      <span className="text-4xl mb-4 block">{cat.icon}</span>
                      <h3 className="text-sm font-black uppercase tracking-wider mb-1">{cat.label}</h3>
                      <p className="text-[10px]" style={{ color: muted }}>{cat.count} products</p>
                    </div>
                    <ArrowRight size={16} style={{ color: GOLD }} className="group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
                      style={{ background: `linear-gradient(135deg, rgba(201,168,76,0.04), transparent)` }} />
                  </motion.button>
                ))}
              </div>
            </section>

            {/* TRENDING PRODUCTS */}
            <section style={{ background: isDark ? '#080808' : '#fff' }} className="py-20">
              <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex items-end justify-between mb-10">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-2" style={{ color: GOLD }}>
                      <TrendingUp size={10} className="inline mr-1" />Trending Now
                    </p>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', lineHeight: 1.1 }} className="font-normal">
                      Best Sellers
                    </h2>
                  </div>
                  <button onClick={() => setPage('catalog')} className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:opacity-70 transition-opacity" style={{ color: GOLD }}>
                    Full Catalog <ArrowRight size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {PRODUCTS.slice(0, 6).map((prod, i) => (
                    <ProductCard key={prod.id} prod={prod} i={i} isDark={isDark} surface={surface} border={border} muted={muted}
                      onAdd={addToCart} onWish={toggleWishlist} onCompare={toggleCompare} onView={setSelectedProduct}
                      isWished={wishlist.includes(prod.id)} isCompared={compareItems.some(c => c.id === prod.id)} addedId={addedId} />
                  ))}
                </div>

                <div className="text-center mt-12">
                  <button onClick={() => setPage('catalog')}
                    style={{ background: '#0a0a0a', color: '#f5f0e8' }}
                    className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl active:scale-[0.98]">
                    Explore Full Collection <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </section>

            {/* AI FEATURES BANNER */}
            <section className="py-20 px-6 md:px-12">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: <Scale size={24} style={{ color: GOLD }} />, title: 'AI Spec Compare', desc: 'Select up to 3 products. Our Gemini AI builds a real-time side-by-side specifications matrix automatically.' },
                    { icon: <Sparkles size={24} style={{ color: GOLD }} />, title: 'Budget Optimizer', desc: 'Enter your total budget and let AI construct the most value-optimized cart bundle within your limits.' },
                    { icon: <Mic size={24} style={{ color: GOLD }} />, title: 'Voice Search', desc: 'Search naturally with your voice. Say "Show me laptops under ₹1,50,000" and watch AI filter instantly.' },
                  ].map((f, i) => (
                    <motion.div key={f.title}
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      className="p-8 rounded-3xl"
                      style={{ background: isDark ? '#111' : '#fff', border: `1px solid ${border}` }}>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                        style={{ background: 'rgba(201,168,76,0.08)' }}>
                        {f.icon}
                      </div>
                      <h3 className="font-black text-sm mb-2">{f.title}</h3>
                      <p className="text-xs leading-relaxed" style={{ color: muted }}>{f.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* NEWSLETTER */}
            <section className="py-20 px-6 md:px-12" style={{ background: '#0a0a0a' }}>
              <div className="max-w-2xl mx-auto text-center">
                <span className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: GOLD }}>
                  <Gem size={10} className="inline mr-1" />Exclusive Access
                </span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#f5f0e8', fontSize: '2.8rem' }}
                  className="mt-3 mb-4 font-normal leading-tight">
                  Join The Inner Circle
                </h2>
                <p className="text-sm mb-8" style={{ color: '#666' }}>
                  Get early access to new collections, exclusive member offers, and 200 bonus Luxe Points on signup.
                </p>
                {newsletterSubmitted ? (
                  <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="flex items-center justify-center gap-3 py-4">
                    <Check size={20} style={{ color: GOLD }} />
                    <span className="font-bold" style={{ color: '#f5f0e8' }}>You're in! Welcome to the inner circle. ✦</span>
                  </motion.div>
                ) : (
                  <form onSubmit={e => { e.preventDefault(); setNewsletterSubmitted(true); showToast('Welcome to LUXE Inner Circle! 200 points added.'); }}
                    className="flex gap-3">
                    <input type="email" required value={newsletterEmail}
                      onChange={e => setNewsletterEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 py-4 px-6 rounded-2xl text-sm font-medium focus:outline-none"
                      style={{ background: '#161616', border: '1px solid #2a2a2a', color: '#f5f0e8', caretColor: GOLD }} />
                    <button type="submit" style={{ background: GOLD }}
                      className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:opacity-90 transition-all whitespace-nowrap">
                      Join Now
                    </button>
                  </form>
                )}
              </div>
            </section>

            {/* FOOTER */}
            <footer style={{ background: '#060606', borderTop: '1px solid #1a1a1a', color: '#f5f0e8' }} className="py-16 px-6 md:px-12">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold mb-4">
                    LUXE<span style={{ color: GOLD }}>.</span>
                  </div>
                  <p className="text-xs leading-relaxed mb-5" style={{ color: '#555' }}>
                    AI-powered luxury shopping platform. Curated collections, intelligent recommendations, premium service.
                  </p>
                  <div className="flex items-center gap-3">
                    {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                      <button key={i} className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-70"
                        style={{ border: '1px solid #2a2a2a' }}>
                        <Icon size={13} style={{ color: '#666' }} />
                      </button>
                    ))}
                  </div>
                </div>
                {[
                  { title: 'Collections', links: ['Laptops', 'Mobiles', 'Footwear', 'Audio', 'Accessories'] },
                  { title: 'Services', links: ['AI Search', 'Budget Optimizer', 'Compare Specs', 'Luxe Points', 'Express Delivery'] },
                  { title: 'Company', links: ['About LUXE', 'Privacy Policy', 'Terms of Service', 'Contact', 'Careers'] },
                ].map(col => (
                  <div key={col.title}>
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: GOLD }}>{col.title}</h4>
                    <ul className="flex flex-col gap-2.5">
                      {col.links.map(l => (
                        <li key={l}>
                          <button className="text-xs transition-colors hover:opacity-70" style={{ color: '#555' }}>{l}</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #1a1a1a' }} className="max-w-7xl mx-auto mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-[9px] uppercase tracking-widest" style={{ color: '#333' }}>
                  © 2026 LUXE Premium AI Systems. All rights reserved.
                </p>
                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest" style={{ color: '#333' }}>
                  <Shield size={10} /> Secured & SSL Encrypted
                </div>
              </div>
            </footer>

          </motion.div>
        )}

        {/* ────── CATALOG PAGE ────── */}
        {page === 'catalog' && (
          <motion.div key="catalog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

            {/* Catalog Hero Header */}
            <div style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }} className="py-14 px-6 md:px-12">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-2" style={{ color: GOLD }}>Winter '24 Collection</p>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#f5f0e8', fontSize: '3rem', lineHeight: 1.1 }}
                      className="font-normal">Catalog Collections</h1>
                    <p className="text-sm mt-2" style={{ color: '#555' }}>
                      {filteredProducts.length} premium products available
                    </p>
                  </div>
                  <div className="hidden md:flex items-center gap-3">
                    {aiResponse && (
                      <div className="flex items-center gap-2 py-2 px-4 rounded-xl text-xs" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', color: GOLD }}>
                        <Sparkles size={12} /> AI Filter: "{aiResponse.query}"
                        <button onClick={() => { setAiResponse(null); setSearchVal(''); }} className="ml-1"><X size={12} /></button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Tabs */}
                <div className="flex items-center gap-3 mt-8 overflow-x-auto pb-1">
                  {CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                      style={{
                        background: activeCategory === cat.id ? GOLD : 'transparent',
                        color: activeCategory === cat.id ? '#fff' : '#666',
                        border: `1px solid ${activeCategory === cat.id ? GOLD : '#2a2a2a'}`,
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all hover:opacity-90">
                      <span>{cat.icon}</span> {cat.label}
                      <span className="text-[8px] opacity-60">({cat.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Catalog Body */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">

              {/* Toolbar */}
              <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
                <div className="flex items-center gap-4">
                  <button onClick={() => setShowFilters(!showFilters)}
                    style={{ border: `1px solid ${border}` }}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all hover:opacity-80">
                    <SlidersHorizontal size={13} style={{ color: GOLD }} />
                    {showFilters ? 'Hide' : 'Show'} Filters
                  </button>
                  {(selectedBrands.length > 0 || selectedRating > 0 || inStockOnly || priceRange < 200000) && (
                    <button onClick={resetFilters} className="text-[10px] font-black uppercase tracking-wider hover:opacity-70 transition-opacity" style={{ color: GOLD }}>
                      Clear All Filters
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: muted }}>Sort</span>
                    <select value={sortOption} onChange={e => setSortOption(e.target.value)}
                      style={{ background: 'transparent', border: `1px solid ${border}`, color: text }}
                      className="text-xs font-semibold py-2 px-3 rounded-xl focus:outline-none">
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low → High</option>
                      <option value="price-high">Price: High → Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="reviews">Most Reviewed</option>
                    </select>
                  </div>
                  <div style={{ border: `1px solid ${border}` }} className="flex rounded-xl overflow-hidden">
                    {[['grid', <Grid size={14} />], ['list', <List size={14} />]].map(([type, icon]) => (
                      <button key={type} onClick={() => setViewType(type)}
                        style={{ background: viewType === type ? GOLD : 'transparent', color: viewType === type ? '#fff' : muted }}
                        className="px-3 py-2 transition-all">
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`grid gap-8 ${showFilters ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>

                {/* FILTER SIDEBAR */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.aside key="filters" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="lg:col-span-3 flex flex-col gap-6 h-fit"
                      style={{ background: isDark ? '#111' : '#fff', border: `1px solid ${border}`, borderRadius: 24, padding: 24 }}>

                      <div className="flex items-center justify-between" style={{ borderBottom: `1px solid ${border}`, paddingBottom: 16 }}>
                        <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <Filter size={13} style={{ color: GOLD }} /> Filters
                        </h3>
                        <button onClick={resetFilters} style={{ color: GOLD }} className="text-[9px] font-black uppercase hover:opacity-70">Reset</button>
                      </div>

                      {/* Price */}
                      <div>
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-wider mb-3" style={{ color: muted }}>
                          <span>Max Price</span>
                          <span style={{ color: text }}>₹{priceRange.toLocaleString()}</span>
                        </div>
                        <input type="range" min={10000} max={200000} step={5000} value={priceRange}
                          onChange={e => setPriceRange(Number(e.target.value))}
                          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                          style={{ accentColor: GOLD, background: isDark ? '#2a2a2a' : '#e8e2d8' }} />
                        <div className="flex justify-between mt-1 text-[9px]" style={{ color: muted }}>
                          <span>₹10,000</span><span>₹2,00,000</span>
                        </div>
                      </div>

                      {/* Brands */}
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-wider mb-3" style={{ color: muted }}>Brand</p>
                        <div className="flex flex-col gap-2 max-h-44 overflow-y-auto">
                          {BRANDS.map(b => (
                            <label key={b} className="flex items-center gap-2.5 cursor-pointer group">
                              <div onClick={() => setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b])}
                                className="w-4 h-4 rounded-md border flex items-center justify-center cursor-pointer transition-all"
                                style={{ borderColor: selectedBrands.includes(b) ? GOLD : border, background: selectedBrands.includes(b) ? GOLD : 'transparent' }}>
                                {selectedBrands.includes(b) && <Check size={10} color="#fff" />}
                              </div>
                              <span className="text-xs font-medium group-hover:opacity-70 transition-opacity">{b}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Rating */}
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-wider mb-3" style={{ color: muted }}>Min Rating</p>
                        <div className="flex gap-2">
                          {[4, 3, 2].map(r => (
                            <button key={r} onClick={() => setSelectedRating(selectedRating === r ? 0 : r)}
                              style={{ background: selectedRating === r ? '#0a0a0a' : 'transparent', color: selectedRating === r ? '#fff' : muted, border: `1px solid ${selectedRating === r ? '#0a0a0a' : border}` }}
                              className="flex-1 py-2 rounded-xl text-[10px] font-black transition-all">
                              {r}★+
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* In Stock */}
                      <div className="flex items-center justify-between" style={{ borderTop: `1px solid ${border}`, paddingTop: 16 }}>
                        <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: muted }}>In Stock Only</span>
                        <button onClick={() => setInStockOnly(!inStockOnly)}
                          style={{ background: inStockOnly ? GOLD : isDark ? '#2a2a2a' : '#e8e2d8' }}
                          className="relative w-10 h-5 rounded-full transition-all duration-300">
                          <span style={{ left: inStockOnly ? '22px' : '2px' }}
                            className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300" />
                        </button>
                      </div>

                      {/* Budget Optimizer */}
                      <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 16, padding: 16 }}>
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles size={13} style={{ color: GOLD }} />
                          <span className="text-[9px] font-black uppercase tracking-wider">AI Budget Optimizer</span>
                        </div>
                        <form onSubmit={handleBudget} className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black" style={{ color: muted }}>₹</span>
                            <input type="number" placeholder="50000" value={budgetVal} onChange={e => setBudgetVal(e.target.value)}
                              className="w-full py-2 pl-7 pr-3 rounded-lg text-xs font-bold focus:outline-none"
                              style={{ background: isDark ? '#1a1a1a' : '#f5f0e8', border: `1px solid ${border}`, color: text }} />
                          </div>
                          <button type="submit" style={{ background: GOLD }}
                            className="px-3 py-2 rounded-lg text-[9px] font-black text-white uppercase">GO</button>
                        </form>
                        <AnimatePresence>
                          {budgetResult && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                              className="mt-3 overflow-hidden">
                              <p className="text-[9px] leading-relaxed mb-2" style={{ color: muted }}>{budgetResult.strategy}</p>
                              <div className="flex flex-col gap-1.5">
                                {budgetResult.items.map(item => (
                                  <div key={item.id} className="flex items-center justify-between">
                                    <span className="text-xs font-bold truncate max-w-[140px]">{item.name}</span>
                                    <button onClick={() => addToCart(item)} style={{ background: GOLD }}
                                      className="w-6 h-6 rounded-lg flex items-center justify-center">
                                      <Plus size={11} color="#fff" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-between items-center mt-2 pt-2" style={{ borderTop: `1px solid ${border}` }}>
                                <span className="text-[9px] font-black" style={{ color: GOLD }}>Total: ₹{budgetResult.total.toLocaleString()}</span>
                                <button onClick={() => setBudgetResult(null)} style={{ color: muted }} className="text-[9px]">Clear</button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Compare Panel */}
                      {compareItems.length > 0 && (
                        <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 16, padding: 16 }}>
                          <div className="flex items-center gap-2 mb-3">
                            <Scale size={13} style={{ color: GOLD }} />
                            <span className="text-[9px] font-black uppercase tracking-wider">Compare ({compareItems.length}/3)</span>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            {compareItems.map(item => (
                              <div key={item.id} className="flex items-center justify-between">
                                <span className="text-[10px] font-bold truncate max-w-[140px]">{item.name}</span>
                                <button onClick={() => toggleCompare(item)} style={{ color: '#ef4444' }} className="text-[9px]">×</button>
                              </div>
                            ))}
                          </div>
                          {compareItems.length >= 2 && (
                            <button onClick={() => setShowCompare(true)} style={{ background: '#0a0a0a', color: '#fff' }}
                              className="w-full py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider hover:opacity-90">
                              Generate Matrix
                            </button>
                          )}
                        </div>
                      )}
                    </motion.aside>
                  )}
                </AnimatePresence>

                {/* PRODUCT GRID */}
                <main className={showFilters ? 'lg:col-span-9' : 'col-span-1'}>
                  {filteredProducts.length === 0 ? (
                    <div className="py-24 text-center flex flex-col items-center gap-4">
                      <Sparkles size={48} style={{ color: isDark ? '#2a2a2a' : '#e8e2d8' }} />
                      <p className="text-sm font-bold" style={{ color: muted }}>No products match your filters.</p>
                      <button onClick={resetFilters} style={{ background: GOLD }} className="px-6 py-2.5 rounded-full text-xs font-black text-white uppercase">Reset Filters</button>
                    </div>
                  ) : viewType === 'grid' ? (
                    <div className={`grid gap-5 ${showFilters ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                      {filteredProducts.map((prod, i) => (
                        <ProductCard key={prod.id} prod={prod} i={i} isDark={isDark} surface={surface} border={border} muted={muted}
                          onAdd={addToCart} onWish={toggleWishlist} onCompare={toggleCompare} onView={setSelectedProduct}
                          isWished={wishlist.includes(prod.id)} isCompared={compareItems.some(c => c.id === prod.id)} addedId={addedId} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {filteredProducts.map((prod) => (
                        <ProductListRow key={prod.id} prod={prod} isDark={isDark} surface={surface} border={border} muted={muted}
                          onAdd={addToCart} onWish={toggleWishlist} onView={setSelectedProduct}
                          isWished={wishlist.includes(prod.id)} addedId={addedId} />
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {filteredProducts.length > 0 && (
                    <div className="flex items-center justify-between mt-10 pt-6" style={{ borderTop: `1px solid ${border}` }}>
                      <button className="text-[10px] font-black uppercase tracking-wider opacity-30 cursor-not-allowed" disabled style={{ color: text }}>← Previous</button>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3].map(n => (
                          <button key={n} style={{ background: n === 1 ? GOLD : 'transparent', color: n === 1 ? '#fff' : muted, border: `1px solid ${n === 1 ? GOLD : border}` }}
                            className="w-9 h-9 rounded-full text-xs font-black transition-all">
                            {n}
                          </button>
                        ))}
                        <span style={{ color: muted }} className="text-xs px-1">...</span>
                        <button style={{ border: `1px solid ${border}`, color: muted }} className="w-9 h-9 rounded-full text-xs font-black">10</button>
                      </div>
                      <button className="text-[10px] font-black uppercase tracking-wider hover:opacity-70 transition-opacity" style={{ color: GOLD }}>Next →</button>
                    </div>
                  )}
                </main>
              </div>
            </div>
          </motion.div>
        )}

        {/* ────── PROFILE PAGE ────── */}
        {page === 'profile' && user && (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Profile Header */}
            <div style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }} className="py-14 px-6 md:px-12">
              <div className="max-w-7xl mx-auto flex items-center gap-8">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-white"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})` }}>
                  {user.name[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#f5f0e8', fontSize: '2rem' }}
                      className="font-normal">{user.name}</h1>
                    <span style={{ background: 'rgba(201,168,76,0.1)', color: GOLD, border: '1px solid rgba(201,168,76,0.2)' }}
                      className="text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                      <Crown size={9} className="inline mr-1" />Gold Member
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: '#555' }}>{user.email}</p>
                  <div className="flex items-center gap-2 mt-2" style={{ color: GOLD }}>
                    <Star size={13} fill={GOLD} />
                    <span className="text-sm font-black">{user.points?.toLocaleString() || 0} Luxe Points</span>
                  </div>
                </div>
                <div className="ml-auto">
                  <button onClick={() => { setUser(null); setPage('home'); showToast('Signed out successfully'); }}
                    style={{ border: '1px solid #2a2a2a', color: '#666' }}
                    className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:border-red-500 hover:text-red-500 transition-all">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
                {[
                  { icon: <Crown size={20} style={{ color: GOLD }} />, label: 'Membership', value: 'Gold Tier', bg: 'rgba(201,168,76,0.08)' },
                  { icon: <Star size={20} style={{ color: GOLD }} />, label: 'Luxe Points', value: (user.points || 1250).toLocaleString(), bg: 'rgba(201,168,76,0.08)' },
                  { icon: <Package size={20} style={{ color: '#6366f1' }} />, label: 'Total Orders', value: '7', bg: 'rgba(99,102,241,0.08)' },
                  { icon: <ShoppingBag size={20} style={{ color: '#10b981' }} />, label: 'Wishlist Items', value: wishlist.length.toString(), bg: 'rgba(16,185,129,0.08)' },
                ].map(s => (
                  <div key={s.label} className="p-6 rounded-3xl flex items-center gap-4"
                    style={{ background: isDark ? '#111' : '#fff', border: `1px solid ${border}` }}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: s.bg }}>
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wider mb-0.5" style={{ color: muted }}>{s.label}</p>
                      <p className="text-lg font-black">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Wishlist */}
              <div className="mb-10">
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem' }} className="font-normal mb-6">
                  Your Wishlist <span style={{ color: GOLD }}>({wishlist.length})</span>
                </h2>
                {wishlist.length === 0 ? (
                  <div className="py-16 text-center rounded-3xl" style={{ border: `1px dashed ${border}` }}>
                    <Heart size={36} style={{ color: isDark ? '#2a2a2a' : '#e8e2d8', margin: '0 auto 12px' }} />
                    <p className="text-sm font-bold" style={{ color: muted }}>Your wishlist is empty.</p>
                    <button onClick={() => setPage('catalog')} style={{ background: GOLD }}
                      className="mt-4 px-6 py-2.5 rounded-full text-[10px] font-black text-white uppercase tracking-wider">
                      Browse Catalog
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {PRODUCTS.filter(p => wishlist.includes(p.id)).map((prod, i) => (
                      <ProductCard key={prod.id} prod={prod} i={i} isDark={isDark} surface={surface} border={border} muted={muted}
                        onAdd={addToCart} onWish={toggleWishlist} onCompare={toggleCompare} onView={setSelectedProduct}
                        isWished={true} isCompared={compareItems.some(c => c.id === prod.id)} addedId={addedId} />
                    ))}
                  </div>
                )}
              </div>

              {/* Points Ledger */}
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem' }} className="font-normal mb-6">
                  Points History
                </h2>
                <div className="rounded-3xl overflow-hidden" style={{ border: `1px solid ${border}` }}>
                  {[
                    { event: 'Purchase: MacBook Air M3', points: '+1,149', date: 'May 28, 2026', type: 'earn' },
                    { event: 'Signup Bonus', points: '+100', date: 'May 15, 2026', type: 'earn' },
                    { event: 'Redeemed at Checkout', points: '-200', date: 'May 10, 2026', type: 'spend' },
                  ].map((entry, i) => (
                    <div key={i} style={{ borderBottom: i < 2 ? `1px solid ${border}` : 'none', background: isDark ? '#111' : '#fff' }}
                      className="flex items-center justify-between px-6 py-4">
                      <div>
                        <p className="text-sm font-bold">{entry.event}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: muted }}>{entry.date}</p>
                      </div>
                      <span style={{ color: entry.type === 'earn' ? '#10b981' : '#ef4444' }} className="text-sm font-black">
                        {entry.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ────── ADMIN PAGE ────── */}
        {page === 'admin' && user?.role === 'admin' && (
          <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            {/* Admin Header */}
            <div style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }} className="py-14 px-6 md:px-12">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck size={20} style={{ color: GOLD }} />
                  <span className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: GOLD }}>Admin Console</span>
                </div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#f5f0e8', fontSize: '2.8rem' }}
                  className="font-normal">Systems Dashboard</h1>
                <p className="mt-2 text-sm" style={{ color: '#555' }}>Manage the LUXE catalog and monitor platform performance.</p>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">

              {/* KPI Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
                {[
                  { icon: <BarChart3 size={22} />, label: 'Total Revenue', value: '₹47.2L', change: '+12%', color: '#10b981' },
                  { icon: <User size={22} />, label: 'Registered Users', value: '3,847', change: '+8%', color: '#6366f1' },
                  { icon: <Package size={22} />, label: 'Catalog Products', value: PRODUCTS.length.toString(), change: 'Live', color: GOLD },
                  { icon: <ShoppingBag size={22} />, label: 'Orders Processed', value: '924', change: '+23%', color: '#f43f5e' },
                ].map(stat => (
                  <div key={stat.label} className="p-6 rounded-3xl" style={{ background: isDark ? '#111' : '#fff', border: `1px solid ${border}` }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                        style={{ background: `${stat.color}15`, color: stat.color }}>
                        {stat.icon}
                      </div>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                        style={{ background: `${stat.color}15`, color: stat.color }}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-2xl font-black mb-1">{stat.value}</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: muted }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Product Form */}
                <div className="lg:col-span-5 p-8 rounded-3xl" style={{ background: isDark ? '#111' : '#fff', border: `1px solid ${border}` }}>
                  <div className="flex items-center gap-2 mb-6">
                    <Plus size={16} style={{ color: GOLD }} />
                    <h3 className="text-sm font-black uppercase tracking-wider">Add New Product</h3>
                  </div>
                  <form onSubmit={handleAdminAdd} className="flex flex-col gap-4">
                    {[['Product Title', 'name', 'text', 'E.g. Lumina Pro Watch'],
                      ['Price (₹)', 'price', 'number', '24999'],
                      ['Stock', 'stock', 'number', '10']].map(([label, field, type, ph]) => (
                      <div key={field}>
                        <label className="text-[9px] font-black uppercase tracking-wider block mb-2" style={{ color: muted }}>{label}</label>
                        <input type={type} required placeholder={ph} value={adminForm[field]}
                          onChange={e => setAdminForm(p => ({ ...p, [field]: e.target.value }))}
                          className="w-full py-3 px-4 rounded-xl text-sm font-medium focus:outline-none transition-all"
                          style={{ background: isDark ? '#1a1a1a' : '#f5f0e8', border: `1px solid ${border}`, color: text }} />
                      </div>
                    ))}
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-wider block mb-2" style={{ color: muted }}>Category</label>
                      <select value={adminForm.category} onChange={e => setAdminForm(p => ({ ...p, category: e.target.value }))}
                        className="w-full py-3 px-4 rounded-xl text-sm font-medium focus:outline-none"
                        style={{ background: isDark ? '#1a1a1a' : '#f5f0e8', border: `1px solid ${border}`, color: text }}>
                        {['LAPTOPS', 'MOBILES', 'FOOTWEAR', 'AUDIO', 'ACCESSORIES'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-wider block mb-2" style={{ color: muted }}>Description</label>
                      <textarea rows={3} required value={adminForm.description}
                        onChange={e => setAdminForm(p => ({ ...p, description: e.target.value }))}
                        placeholder="Product description..."
                        className="w-full py-3 px-4 rounded-xl text-sm font-medium focus:outline-none resize-none"
                        style={{ background: isDark ? '#1a1a1a' : '#f5f0e8', border: `1px solid ${border}`, color: text }} />
                    </div>
                    {adminSuccess && (
                      <div className="flex items-center gap-2 text-xs font-bold" style={{ color: '#10b981' }}>
                        <Check size={14} /> {adminSuccess}
                      </div>
                    )}
                    <button type="submit" style={{ background: GOLD }}
                      className="w-full py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:opacity-90 transition-all">
                      Create Product
                    </button>
                  </form>
                </div>

                {/* Orders Ledger */}
                <div className="lg:col-span-7 p-8 rounded-3xl" style={{ background: isDark ? '#111' : '#fff', border: `1px solid ${border}` }}>
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 size={16} style={{ color: GOLD }} />
                    <h3 className="text-sm font-black uppercase tracking-wider">Recent Orders</h3>
                  </div>
                  <div className="overflow-hidden rounded-2xl" style={{ border: `1px solid ${border}` }}>
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr style={{ background: isDark ? '#1a1a1a' : '#f5f0e8', borderBottom: `1px solid ${border}` }}>
                          {['Order ID', 'Customer', 'Total', 'Status'].map(h => (
                            <th key={h} className="px-4 py-3 text-[9px] font-black uppercase tracking-widest" style={{ color: muted }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: '#LX-8821', customer: 'Arjun Sharma', total: '₹1,14,900', status: 'Paid' },
                          { id: '#LX-8820', customer: 'Priya Verma', total: '₹29,990', status: 'Paid' },
                          { id: '#LX-8819', customer: 'Rohit Gupta', total: '₹12,995', status: 'Processing' },
                          { id: '#LX-8818', customer: 'Sneha Patel', total: '₹1,34,900', status: 'Paid' },
                          { id: '#LX-8817', customer: 'Vikram Singh', total: '₹69,999', status: 'Shipped' },
                        ].map((ord, i) => (
                          <tr key={ord.id} style={{ borderBottom: i < 4 ? `1px solid ${border}` : 'none' }}
                            className="hover:opacity-80 transition-opacity">
                            <td className="px-4 py-3.5 font-bold text-[10px]" style={{ color: GOLD }}>{ord.id}</td>
                            <td className="px-4 py-3.5 font-medium">{ord.customer}</td>
                            <td className="px-4 py-3.5 font-black">{ord.total}</td>
                            <td className="px-4 py-3.5">
                              <span className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider"
                                style={{
                                  background: ord.status === 'Paid' ? 'rgba(16,185,129,0.1)' : ord.status === 'Shipped' ? 'rgba(99,102,241,0.1)' : 'rgba(251,191,36,0.1)',
                                  color: ord.status === 'Paid' ? '#10b981' : ord.status === 'Shipped' ? '#6366f1' : '#fbbf24',
                                }}>
                                {ord.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Access denied pages */}
        {page === 'profile' && !user && (
          <motion.div key="profile-denied" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 gap-6">
            <User size={48} style={{ color: isDark ? '#2a2a2a' : '#e8e2d8' }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem' }}>Sign In Required</h2>
            <p style={{ color: muted }} className="text-sm">Sign in to access your profile and order history.</p>
            <button onClick={() => setShowAuth(true)} style={{ background: GOLD }}
              className="px-8 py-3.5 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:opacity-90 transition-all">
              Sign In to LUXE
            </button>
          </motion.div>
        )}

        {page === 'admin' && user?.role !== 'admin' && (
          <motion.div key="admin-denied" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 gap-6">
            <ShieldCheck size={48} style={{ color: isDark ? '#2a2a2a' : '#e8e2d8' }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem' }}>Access Restricted</h2>
            <p style={{ color: muted }} className="text-sm">Administrator privileges are required to access this area.</p>
            <button onClick={() => setPage('home')} style={{ background: GOLD }}
              className="px-8 py-3.5 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:opacity-90 transition-all">
              Return Home
            </button>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
           CART FLYOUT
          ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
            <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '105%' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm flex flex-col"
              style={{ background: isDark ? '#0d0d0d' : '#fff', borderLeft: `1px solid ${border}` }}>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${border}` }}>
                <div className="flex items-center gap-2">
                  <ShoppingBag size={17} style={{ color: GOLD }} />
                  <h3 className="text-sm font-black uppercase tracking-widest">Your Luxe Bag</h3>
                  {cartCount > 0 && (
                    <span style={{ background: GOLD }} className="w-5 h-5 rounded-full text-[9px] font-black text-white flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <button onClick={() => setIsCartOpen(false)} className="hover:opacity-70 transition-opacity" style={{ color: muted }}>
                  <X size={18} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16 text-center">
                    <ShoppingBag size={52} style={{ color: isDark ? '#2a2a2a' : '#e8e2d8' }} />
                    <p className="text-sm font-black uppercase tracking-wider" style={{ color: muted }}>Your bag is empty</p>
                    <p className="text-xs" style={{ color: muted }}>Explore our curated collections</p>
                    <button onClick={() => { setIsCartOpen(false); setPage('catalog'); }}
                      style={{ background: GOLD }} className="mt-2 px-8 py-3 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest">
                      Shop Catalog
                    </button>
                  </div>
                ) : (
                  <AnimatePresence>
                    {cart.map(item => (
                      <motion.div key={item.id} layout exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.2 }}
                        className="flex gap-4 items-center p-4 rounded-2xl"
                        style={{ background: isDark ? '#161616' : '#fafafa', border: `1px solid ${border}` }}>
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ background: isDark ? '#0a0a0a' : '#f0ece4' }}>
                          {item.image}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: muted }}>{item.brand}</p>
                          <p className="text-xs font-black truncate">{item.name}</p>
                          <p className="text-xs font-black mt-1" style={{ color: GOLD }}>₹{item.price.toLocaleString()}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateQty(item.id, -1)}
                              className="w-6 h-6 rounded-lg flex items-center justify-center hover:opacity-70 transition-opacity"
                              style={{ border: `1px solid ${border}`, color: muted }}>
                              <Minus size={9} />
                            </button>
                            <span className="text-xs font-black w-5 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)}
                              className="w-6 h-6 rounded-lg flex items-center justify-center hover:opacity-70 transition-opacity"
                              style={{ border: `1px solid ${border}`, color: muted }}>
                              <Plus size={9} />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3 flex-shrink-0">
                          <button onClick={() => removeFromCart(item.id)} className="hover:opacity-70 transition-opacity" style={{ color: muted }}>
                            <Trash2 size={13} />
                          </button>
                          <span className="text-xs font-black">₹{(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="px-6 py-5" style={{ borderTop: `1px solid ${border}` }}>
                  {/* Trust badges */}
                  <div className="flex items-center gap-4 mb-4">
                    {[<><Truck size={11} /> Free Shipping</>, <><Shield size={11} /> Secure Pay</>, <><RotateCcw size={11} /> 30-day Returns</>].map((b, i) => (
                      <span key={i} className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider" style={{ color: muted }}>{b}</span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex justify-between text-xs font-semibold" style={{ color: muted }}>
                      <span>Subtotal</span><span style={{ color: text }} className="font-bold">₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold" style={{ color: muted }}>
                      <span>Delivery</span><span style={{ color: '#10b981' }} className="font-bold">Complimentary</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-black pt-2" style={{ borderTop: `1px solid ${border}` }}>
                      <span>Total</span><span>₹{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <button onClick={() => { setCart([]); setIsCartOpen(false); showToast('Order placed! ✦ Luxe Points earned.'); }}
                    style={{ background: GOLD }}
                    className="w-full py-4 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:opacity-90 transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-2">
                    <CreditCard size={14} /> Secure Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
           PRODUCT DETAIL MODAL
          ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}>
            <motion.div initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
              style={{ background: isDark ? '#0d0d0d' : '#fff', border: `1px solid ${border}` }}>

              <button onClick={() => setSelectedProduct(null)}
                className="absolute right-5 top-5 z-10 w-9 h-9 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
                style={{ background: isDark ? '#1a1a1a' : '#f5f0e8', color: muted }}>
                <X size={16} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left: Image */}
                <div className="relative aspect-square flex items-center justify-center text-8xl rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none"
                  style={{ background: isDark ? '#111' : '#f5f0e8' }}>
                  <div className="absolute inset-0 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none"
                    style={{ background: 'radial-gradient(circle at center, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />
                  {selectedProduct.image}
                  {selectedProduct.badge && (
                    <div className="absolute top-5 left-5">
                      <GoldBadge text={selectedProduct.badge} />
                    </div>
                  )}
                </div>

                {/* Right: Info */}
                <div className="p-8 flex flex-col gap-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <GoldBadge text={selectedProduct.category} />
                      <button onClick={() => toggleWishlist(selectedProduct.id)}
                        className="hover:opacity-70 transition-opacity"
                        style={{ color: wishlist.includes(selectedProduct.id) ? '#ef4444' : muted }}>
                        <Heart size={18} fill={wishlist.includes(selectedProduct.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.7rem', lineHeight: 1.2 }}
                      className="font-normal mb-1">{selectedProduct.name}</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: muted }}>{selectedProduct.brand}</p>
                    <div className="flex items-center gap-3">
                      <StarRating rating={selectedProduct.rating} size={13} />
                      <span className="text-xs font-bold" style={{ color: GOLD }}>{selectedProduct.rating}</span>
                      <span className="text-[10px]" style={{ color: muted }}>({selectedProduct.reviews?.toLocaleString()} reviews)</span>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed" style={{ color: muted }}>{selectedProduct.description}</p>

                  {/* Specs */}
                  <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${border}` }}>
                    {Object.entries(selectedProduct.specs).slice(0, 4).map(([k, v], i, arr) => (
                      <div key={k} className="flex justify-between items-center px-4 py-3 text-xs"
                        style={{ borderBottom: i < arr.length - 1 ? `1px solid ${border}` : 'none', background: i % 2 === 0 ? (isDark ? '#111' : '#fafafa') : 'transparent' }}>
                        <span className="font-bold text-[9px] uppercase tracking-wider" style={{ color: muted }}>{k}</span>
                        <span className="font-semibold text-right max-w-[55%]">{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between p-5 rounded-2xl" style={{ background: isDark ? '#111' : '#f5f0e8', border: `1px solid ${border}` }}>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: muted }}>Price</p>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem' }} className="font-bold">
                        ₹{selectedProduct.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { toggleCompare(selectedProduct); }}
                        style={{ border: `1px solid ${compareItems.some(c => c.id === selectedProduct.id) ? GOLD : border}`, color: compareItems.some(c => c.id === selectedProduct.id) ? GOLD : muted }}
                        className="px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all">
                        <Scale size={13} />
                      </button>
                      <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                        style={{ background: GOLD }}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black text-white uppercase tracking-wider hover:opacity-90 transition-all active:scale-[0.98]">
                        <ShoppingBag size={13} /> Add to Bag
                      </button>
                    </div>
                  </div>

                  {/* Stock indicator */}
                  <div className="flex items-center gap-2 text-[10px] font-bold" style={{ color: selectedProduct.stock > 5 ? '#10b981' : selectedProduct.stock > 0 ? GOLD : '#ef4444' }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: 'currentColor' }} />
                    {selectedProduct.stock > 5 ? `${selectedProduct.stock} units in stock` : selectedProduct.stock > 0 ? `Only ${selectedProduct.stock} left — order soon!` : 'Out of stock'}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
           AUTH MODAL
          ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showAuth && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}>
            <motion.div initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 20 }}
              className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
              style={{ background: isDark ? '#0d0d0d' : '#fff', border: `1px solid ${border}` }}>

              {/* Top decorative strip */}
              <div style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})` }} className="h-1.5 w-full" />

              <button onClick={() => setShowAuth(false)}
                className="absolute right-5 top-6 hover:opacity-70 transition-opacity" style={{ color: muted }}>
                <X size={18} />
              </button>

              <div className="p-8">
                <div className="text-center mb-8">
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem' }}
                    className="font-normal mb-1">
                    LUXE<span style={{ color: GOLD }}>.</span>
                  </div>
                  <p className="text-sm" style={{ color: muted }}>
                    {authMode === 'signin' ? 'Welcome back to the inner circle.' : 'Join the luxury experience today.'}
                  </p>
                </div>

                {/* Toggle */}
                <div className="flex rounded-2xl p-1 mb-6" style={{ background: isDark ? '#161616' : '#f5f0e8' }}>
                  {(['signin', 'register'] as const).map(m => (
                    <button key={m} onClick={() => setAuthMode(m)}
                      style={{ background: authMode === m ? GOLD : 'transparent', color: authMode === m ? '#fff' : muted }}
                      className="flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                      {m === 'signin' ? 'Sign In' : 'Register'}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleAuth} className="flex flex-col gap-4">
                  {authMode === 'register' && (
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-wider block mb-2" style={{ color: muted }}>Full Name</label>
                      <input type="text" required value={authForm.name}
                        onChange={e => setAuthForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Your name" className="w-full py-3.5 px-4 rounded-xl text-sm font-medium focus:outline-none"
                        style={{ background: isDark ? '#161616' : '#f5f0e8', border: `1px solid ${border}`, color: text }} />
                    </div>
                  )}
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-wider block mb-2" style={{ color: muted }}>Email</label>
                    <input type="email" required value={authForm.email}
                      onChange={e => setAuthForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="your@email.com" className="w-full py-3.5 px-4 rounded-xl text-sm font-medium focus:outline-none"
                      style={{ background: isDark ? '#161616' : '#f5f0e8', border: `1px solid ${border}`, color: text }} />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-wider block mb-2" style={{ color: muted }}>Password</label>
                    <input type="password" required value={authForm.password}
                      onChange={e => setAuthForm(p => ({ ...p, password: e.target.value }))}
                      placeholder="••••••••" className="w-full py-3.5 px-4 rounded-xl text-sm font-medium focus:outline-none"
                      style={{ background: isDark ? '#161616' : '#f5f0e8', border: `1px solid ${border}`, color: text }} />
                  </div>
                  {authMode === 'signin' && (
                    <p className="text-[9px] font-bold" style={{ color: muted }}>
                      Tip: Use "admin@luxe.com" to get admin access.
                    </p>
                  )}
                  <button type="submit" style={{ background: GOLD }}
                    className="w-full py-4 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:opacity-90 transition-all active:scale-[0.98] mt-2 shadow-xl">
                    {authMode === 'signin' ? 'Sign In to LUXE' : 'Create Account'}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
           AI COMPARE MATRIX MODAL
          ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showCompare && compareItems.length >= 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
            <motion.div initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
              style={{ background: isDark ? '#0d0d0d' : '#fff', border: `1px solid ${border}` }}>

              <div style={{ borderBottom: `1px solid ${border}` }} className="px-8 py-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={13} style={{ color: GOLD }} />
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: GOLD }}>Luxe AI Analytics</span>
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem' }} className="font-normal">
                    Side-by-Side Matrix
                  </h3>
                </div>
                <button onClick={() => setShowCompare(false)} className="hover:opacity-70 transition-opacity" style={{ color: muted }}>
                  <X size={20} />
                </button>
              </div>

              <div className="p-8">
                {/* Product Headers */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${border}` }}>
                        <th className="py-4 pr-6 text-[9px] font-black uppercase tracking-wider w-36" style={{ color: muted }}>Feature</th>
                        {compareItems.map(item => (
                          <th key={item.id} className="py-4 px-4 text-center min-w-[180px]">
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-4xl">{item.image}</span>
                              <span className="font-black text-sm leading-tight">{item.name}</span>
                              <span style={{ color: GOLD }} className="text-sm font-black">₹{item.price.toLocaleString()}</span>
                              <StarRating rating={item.rating} size={11} />
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {['Processor', 'Display', 'Battery Life', 'Weight', 'Material', 'Key Advantage'].map((feature, i) => (
                        <tr key={feature} style={{ borderBottom: `1px solid ${border}`, background: i % 2 === 0 ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)') : 'transparent' }}>
                          <td className="py-4 pr-6 text-[9px] font-black uppercase tracking-wider" style={{ color: muted }}>{feature}</td>
                          {compareItems.map(item => (
                            <td key={item.id} className="py-4 px-4 text-center text-xs font-medium leading-relaxed">
                              {item.specs[feature] || '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Verdict */}
                <div className="mt-6 p-6 rounded-2xl" style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Crown size={14} style={{ color: GOLD }} />
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: GOLD }}>LUXE AI Verdict</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: muted }}>
                    Based on comprehensive spec analysis, the <strong style={{ color: text }}>{compareItems.sort((a, b) => b.price - a.price)[0].name}</strong> leads
                    in premium performance. For everyday value and extended battery life,
                    the <strong style={{ color: text }}>{compareItems[compareItems.length - 1].name}</strong> provides the most balanced proposition.
                  </p>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <button onClick={() => { setCompareItems([]); setShowCompare(false); }}
                    style={{ color: muted }} className="text-xs font-black uppercase tracking-wider hover:opacity-70 transition-opacity">
                    Clear Compare Queue
                  </button>
                  <button onClick={() => setShowCompare(false)} style={{ background: '#0a0a0a', color: '#fff' }}
                    className="px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90">
                    Close Matrix
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
           TOAST NOTIFICATIONS
          ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 60, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            className="fixed bottom-6 right-6 z-[60] max-w-sm flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl"
            style={{ background: isDark ? '#161616' : '#fff', border: `1px solid ${border}`, color: text, backdropFilter: 'blur(20px)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201,168,76,0.1)' }}>
              <Sparkles size={13} style={{ color: GOLD }} />
            </div>
            <p className="text-xs font-semibold leading-snug flex-1">{toast.msg}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  PRODUCT CARD COMPONENT
// ─────────────────────────────────────────────────────────────
function ProductCard({ prod, i, isDark, surface, border, muted, onAdd, onWish, onCompare, onView, isWished, isCompared, addedId }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(i * 0.05, 0.3) }}
      className="group relative rounded-3xl overflow-hidden flex flex-col cursor-pointer"
      style={{ background: isDark ? '#111' : '#fff', border: `1px solid ${border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}>

      {/* Image Area */}
      <div className="relative aspect-[4/3] flex items-center justify-center text-5xl overflow-hidden"
        style={{ background: isDark ? '#0a0a0a' : '#f5f0e8' }}
        onClick={() => onView(prod)}>
        <motion.span whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>{prod.image}</motion.span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Quick view overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur px-4 py-2 rounded-full">
            <Eye size={12} /> Quick View
          </span>
        </div>
      </div>

      {/* Badges & Wishlist */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
        {prod.badge && <GoldBadge text={prod.badge} />}
        <button onClick={() => onWish(prod.id)}
          className="ml-auto w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 backdrop-blur"
          style={{ background: isDark ? 'rgba(17,17,17,0.8)' : 'rgba(255,255,255,0.8)', border: `1px solid ${border}`, color: isWished ? '#ef4444' : muted }}>
          <Heart size={13} fill={isWished ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div onClick={() => onView(prod)}>
          <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: muted }}>{prod.brand}</p>
          <h4 className="text-sm font-black leading-tight line-clamp-2 hover:opacity-70 transition-opacity">{prod.name}</h4>
        </div>

        <div className="flex items-center gap-2">
          <StarRating rating={prod.rating} size={10} />
          <span className="text-[9px] font-semibold" style={{ color: muted }}>({prod.reviews?.toLocaleString()})</span>
        </div>

        <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${border}` }}>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem' }} className="font-bold">
              ₹{prod.price.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => onCompare(prod)}
              className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider transition-all"
              style={{ color: isCompared ? '#c9a84c' : muted }}>
              <Scale size={11} />
            </button>

            <button onClick={() => onAdd(prod)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all active:scale-[0.97]"
              style={{
                background: addedId === prod.id ? '#10b981' : '#c9a84c',
                color: '#fff', minWidth: 80, justifyContent: 'center'
              }}>
              {addedId === prod.id ? <><Check size={10} /> Added</> : <>Add to Bag</>}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
//  PRODUCT LIST ROW COMPONENT
// ─────────────────────────────────────────────────────────────
function ProductListRow({ prod, isDark, surface, border, muted, onAdd, onWish, onView, isWished, addedId }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-5 items-center p-5 rounded-2xl group transition-all"
      style={{ background: isDark ? '#111' : '#fff', border: `1px solid ${border}` }}
      whileHover={{ boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>

      <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 cursor-pointer group-hover:scale-105 transition-transform"
        style={{ background: isDark ? '#0a0a0a' : '#f5f0e8' }}
        onClick={() => onView(prod)}>
        {prod.image}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: muted }}>{prod.brand}</p>
            <h4 className="font-black text-sm mb-1 cursor-pointer hover:opacity-70 transition-opacity" onClick={() => onView(prod)}>
              {prod.name}
            </h4>
            <div className="flex items-center gap-2">
              <StarRating rating={prod.rating} size={10} />
              <span className="text-[9px]" style={{ color: muted }}>({prod.reviews?.toLocaleString()})</span>
            </div>
          </div>
          <button onClick={() => onWish(prod.id)} style={{ color: isWished ? '#ef4444' : muted }} className="flex-shrink-0">
            <Heart size={16} fill={isWished ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3 flex-shrink-0">
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem' }} className="font-bold">
          ₹{prod.price.toLocaleString()}
        </p>
        <button onClick={() => onAdd(prod)}
          className="px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all active:scale-[0.97]"
          style={{ background: addedId === prod.id ? '#10b981' : '#c9a84c', color: '#fff' }}>
          {addedId === prod.id ? '✓ Added' : 'Add to Bag'}
        </button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
//  STAR RATING — must be defined in outer scope
// ─────────────────────────────────────────────────────────────
function StarRating({ rating, size = 12 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={size}
          style={{ color: s <= Math.round(rating) ? '#c9a84c' : '#d1d5db', fill: s <= Math.round(rating) ? '#c9a84c' : 'none' }} />
      ))}
    </div>
  );
}

function GoldBadge({ text }) {
  return (
    <span style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.25)' }}
      className="px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-[0.15em] whitespace-nowrap">
      {text}
    </span>
  );
}
