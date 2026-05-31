import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, SlidersHorizontal, Scale, DollarSign, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, setSearchQuery, toggleCompareItem, clearCompare, setCompareData, setBudgetPlan, setLoading, setError } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import VoiceAssistant from '../components/VoiceAssistant';
import { Link } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const { products, searchQuery, compareItems, compareData, budgetPlan, loading } = useSelector(state => state.products);
  const [naturalQuery, setNaturalQuery] = useState('');
  const [budgetInput, setBudgetInput] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [comparing, setComparing] = useState(false);
  const [generatingBudget, setGeneratingBudget] = useState(false);

  // Fetch initial seeded products
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axios.get(`/api/products${categoryFilter ? `?category=${categoryFilter}` : ''}`);
        dispatch(setProducts(res.data));
      } catch (err) {
        dispatch(setError('Failed to load products.'));
      }
    };
    fetchInitial();
  }, [categoryFilter, dispatch]);

  // Handle AI Search Submission
  const handleAiSearch = async (e) => {
    e.preventDefault();
    if (!naturalQuery.trim()) return;
    try {
      dispatch(setLoading(true));
      const res = await axios.post('/api/products/search/ai', { query: naturalQuery });
      dispatch(setProducts(res.data.products));
      dispatch(setSearchQuery(naturalQuery));
    } catch (err) {
      dispatch(setError('AI search parser failed.'));
    }
  };

  // Reset Search Filters
  const handleReset = async () => {
    setNaturalQuery('');
    setCategoryFilter('');
    dispatch(setSearchQuery(''));
    try {
      dispatch(setLoading(true));
      const res = await axios.get('/api/products');
      dispatch(setProducts(res.data));
    } catch (err) {
      dispatch(setError('Failed to reset filters.'));
    }
  };

  // Run AI Product Comparison
  const handleCompare = async () => {
    if (compareItems.length < 2) return;
    try {
      setComparing(true);
      const ids = compareItems.map(item => item._id);
      const res = await axios.post('/api/products/compare/ai', { productIds: ids });
      dispatch(setCompareData(res.data));
    } catch (err) {
      console.error(err);
    } finally {
      setComparing(false);
    }
  };

  // Run Smart Budget Plan Optimizer
  const handleBudgetPlan = async (e) => {
    e.preventDefault();
    if (!budgetInput || isNaN(budgetInput)) return;
    try {
      setGeneratingBudget(true);
      const res = await axios.post('/api/products/budget/ai', { budget: Number(budgetInput) });
      dispatch(setBudgetPlan(res.data));
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingBudget(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Hero Header */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 md:p-12 flex flex-col gap-6 shadow-xl border border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold-500 via-transparent to-transparent"></div>
        <div className="flex flex-col gap-2 max-w-xl z-10">
          <span className="text-[10px] font-bold tracking-widest text-gold-500 uppercase flex items-center gap-1">
            <Sparkles size={11} className="animate-spin" /> Next-Generation Shopping
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight font-serif text-slate-100">
            Intelligent Luxury, Curated For You.
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed mt-2 font-medium">
            Search naturally, compare models automatically using AI, and earn premium reward Luxe Points with every purchase.
          </p>
        </div>

        {/* Natural Search Form */}
        <form onSubmit={handleAiSearch} className="flex flex-col md:flex-row gap-3 z-10 max-w-3xl mt-2 w-full">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder='Try typing: "Find running shoes under ₹3000" or "gaming laptops below 70000"'
              value={naturalQuery}
              onChange={(e) => setNaturalQuery(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-gold-500 text-slate-100 placeholder-slate-450 shadow-inner"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-6 py-3.5 rounded-2xl text-xs font-extrabold tracking-wider transition-all flex items-center justify-center gap-2 w-full md:w-auto shadow-md">
              <Sparkles size={14} className="animate-pulse" /> ASK AI
            </button>
            <VoiceAssistant onSearchComplete={(prods, spokenText) => setNaturalQuery(spokenText)} />
          </div>
        </form>

        {searchQuery && (
          <div className="flex items-center gap-2 z-10">
            <span className="text-xs text-slate-300 font-medium">
              AI Filter Active: <strong className="text-gold-500">"{searchQuery}"</strong>
            </span>
            <button onClick={handleReset} className="text-[10px] uppercase font-bold tracking-wider text-slate-400 hover:text-slate-200">
              Clear Filter
            </button>
          </div>
        )}
      </section>

      {/* Main Catalog View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Products Grid (8 cols) */}
        <main className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-zinc-200">
              <SlidersHorizontal size={16} className="text-gold-600" /> Catalog Collections
            </h2>
            
            {/* Category tags */}
            <div className="flex gap-2">
              {['', 'Laptops', 'Footwear', 'Mobiles', 'Apparel'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                    categoryFilter === cat
                      ? 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 shadow-sm'
                      : 'glass hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  {cat || 'ALL'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-72 glass rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="glass p-12 rounded-2xl text-center flex flex-col items-center gap-3">
              <Sparkles size={48} className="text-slate-300 dark:text-zinc-700" />
              <p className="text-sm font-semibold text-slate-650 dark:text-zinc-400">
                No matching premium products found in stock. Try resetting your AI filters!
              </p>
              <button onClick={handleReset} className="btn-solid py-2 px-4 rounded-xl text-xs">
                RESET FILTERS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((product) => {
                const isCompared = compareItems.some(i => i._id === product._id);
                return (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-2xl overflow-hidden border border-slate-100/60 dark:border-zinc-800 shadow-sm flex flex-col hover-premium relative group"
                  >
                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-10 bg-slate-900/85 backdrop-blur text-white px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border border-white/10">
                      <ShieldCheck size={10} className="text-gold-500" /> {product.category}
                    </div>

                    {/* Image */}
                    <div className="aspect-[4/3] bg-slate-100 dark:bg-zinc-900 overflow-hidden relative">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">Placeholder Image</div>
                      )}
                    </div>

                    {/* Specs info */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-start gap-2">
                          <Link to={`/product/${product._id}`} className="text-sm font-bold text-slate-800 dark:text-zinc-200 hover:text-gold-600 transition-colors">
                            {product.name}
                          </Link>
                          <span className="text-sm font-black text-slate-900 dark:text-zinc-150">₹{product.price}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100/50 dark:border-zinc-800 pt-4">
                        {/* Compare selector */}
                        <button
                          onClick={() => dispatch(toggleCompareItem(product))}
                          className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            isCompared 
                              ? 'text-gold-600 dark:text-gold-500' 
                              : 'text-slate-400 hover:text-slate-600 dark:hover:text-zinc-350'
                          }`}
                        >
                          <Scale size={11} /> {isCompared ? 'Comparing' : 'Compare'}
                        </button>

                        <button
                          onClick={() => {
                            dispatch(addToCart({
                              product: product._id,
                              name: product.name,
                              price: product.price,
                              image: product.image,
                              qty: 1
                            }));
                          }}
                          className="bg-slate-900 dark:bg-zinc-100 hover:bg-slate-800 text-white dark:text-slate-900 px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>

        {/* Right Column: AI Helpers (4 cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Smart Compare Box */}
          <div className="glass p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 flex flex-col gap-4 shadow-sm relative overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-zinc-250 flex items-center gap-1.5">
              <Scale size={14} className="text-gold-600" /> AI Compare Specs
            </h3>

            {compareItems.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                Click "Compare" on 2 or 3 product cards to generate a high-fidelity specifications comparison matrix powered by Gemini.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  {compareItems.map(item => (
                    <div key={item._id} className="flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50 p-2 rounded-xl border border-slate-100 dark:border-zinc-800">
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 truncate max-w-[180px]">{item.name}</span>
                      <button onClick={() => dispatch(toggleCompareItem(item))} className="text-[10px] text-rose-500 hover:underline">Remove</button>
                    </div>
                  ))}
                </div>

                {compareItems.length >= 2 ? (
                  <button
                    onClick={handleCompare}
                    disabled={comparing}
                    className="w-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 flex items-center justify-center gap-1"
                  >
                    {comparing ? 'COMPARING...' : 'RUN AI SPECS COMPARE'}
                  </button>
                ) : (
                  <p className="text-[10px] text-slate-400">Select at least 1 more product to compare.</p>
                )}
              </div>
            )}

            {/* Compare Results Display */}
            <AnimatePresence>
              {compareData && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 border-t border-slate-100 dark:border-zinc-800 pt-4 flex flex-col gap-3 overflow-hidden"
                >
                  <span className="text-[10px] font-black uppercase text-gold-600 tracking-wider">AI Analytical Verdict:</span>
                  <p className="text-xs leading-relaxed text-slate-650 dark:text-zinc-350 bg-gold-50/10 p-3 rounded-xl border border-gold-500/10">
                    {compareData.recommendation}
                  </p>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-600 dark:text-zinc-400 uppercase">Specs Comparison Matrix</span>
                    <div className="flex flex-col gap-1 text-[11px] font-medium text-slate-650 dark:text-zinc-350">
                      {compareData.specifications && compareData.specifications.map((spec, i) => (
                        <div key={i} className="flex justify-between border-b border-slate-100/50 dark:border-zinc-800 py-1">
                          <span className="font-bold text-slate-700 dark:text-zinc-300">{spec.feature}</span>
                          <span className="text-right text-[10px] font-semibold text-slate-500">{spec.itemA} vs {spec.itemB}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button onClick={() => dispatch(clearCompare())} className="text-[10px] text-slate-450 hover:text-slate-600 underline text-center">Clear Comparison</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Smart Budget Optimizer */}
          <div className="glass p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 flex flex-col gap-4 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-zinc-250 flex items-center gap-1.5">
              <DollarSign size={14} className="text-gold-600" /> AI Budget Shopping
            </h3>

            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
              Enter your absolute lump sum shopping budget and let our Gemini AI construct the most optimized shopping cart matching your limit!
            </p>

            <form onSubmit={handleBudgetPlan} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="E.g. 50000"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 rounded-xl py-2 pl-7 pr-3 text-xs font-bold focus:outline-none focus:border-gold-500 text-slate-800 dark:text-zinc-100"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-extrabold">₹</span>
              </div>
              <button
                type="submit"
                disabled={generatingBudget}
                className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 flex items-center gap-1"
              >
                {generatingBudget ? 'FITTING...' : 'OPTIMIZE'}
              </button>
            </form>

            <AnimatePresence>
              {budgetPlan && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-slate-105 dark:border-zinc-800 pt-4 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-gold-600">Generated Strategy:</span>
                    <span className="text-xs font-black text-slate-850">Est Total: ₹{budgetPlan.totalEstimate}</span>
                  </div>
                  
                  <p className="text-xs leading-relaxed text-slate-650 dark:text-zinc-350 italic bg-gold-50/5 p-2.5 rounded-xl border border-gold-500/10">
                    "{budgetPlan.strategy}"
                  </p>

                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Recommended Bundle items</span>
                    <div className="flex flex-col gap-2">
                      {budgetPlan.itemsToSelect && budgetPlan.itemsToSelect.map((item, i) => (
                        <div key={i} className="flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50 p-2.5 rounded-xl border border-slate-100/50">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700 dark:text-zinc-350">{item.name}</span>
                            <span className="text-[10px] font-semibold text-slate-450">₹{item.price || item.estimatePrice}</span>
                          </div>
                          
                          {/* Add to cart trigger */}
                          <button
                            onClick={() => {
                              dispatch(addToCart({
                                product: item._id || 'mock_accessor_' + i,
                                name: item.name,
                                price: item.price || item.estimatePrice,
                                image: '',
                                qty: 1
                              }));
                            }}
                            className="bg-gold-500 text-slate-900 hover:bg-gold-600 p-1.5 rounded-lg flex items-center justify-center transition-all shadow"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </aside>

      </div>
    </div>
  );
};

export default Home;
