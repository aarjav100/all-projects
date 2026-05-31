import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartQty, removeFromCart, syncCartMetadata, clearCart, addToCart } from '../store/cartSlice';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, subtotal, hasFreeShipping, remainingToFreeShipping, recommendations } = useSelector(state => state.cart);

  // Sync cart metadata with backend to retrieve precise free-shipping recommendations
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const cartItemsFormatted = items.map(item => ({
          product: item.product,
          qty: item.qty
        }));
        const res = await axios.post('/api/cart/metadata', { cartItems: cartItemsFormatted });
        dispatch(syncCartMetadata(res.data));
      } catch (err) {
        console.error('Failed to sync cart metadata', err);
      }
    };
    fetchMetadata();
  }, [items, dispatch]);

  const handleQtyChange = (productId, currentQty, amount) => {
    const nextQty = currentQty + amount;
    if (nextQty >= 1) {
      dispatch(updateCartQty({ product: productId, qty: nextQty }));
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const freeShippingPercentage = Math.min(100, (subtotal / 1000) * 100);

  if (items.length === 0) {
    return (
      <div className="text-center py-16 glass rounded-3xl flex flex-col items-center gap-4 border border-slate-100 max-w-xl mx-auto my-8 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <ShoppingBag size={28} />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-bold text-slate-800">Your Shopping Bag is empty.</h2>
          <p className="text-xs text-slate-500 font-medium">Explore our premium catalog collections to start shopping!</p>
        </div>
        <Link to="/" className="btn-solid py-2.5 px-6 rounded-xl text-xs mt-2">
          EXPLORE CATALOG
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-16">
      <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-zinc-200">
        <ShoppingBag size={18} className="text-gold-600" /> Your Shopping Bag ({items.length} items)
      </h2>

      {/* Dynamic Free Shipping Threshold Meter */}
      <section className="glass p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col gap-3 relative overflow-hidden group">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
            <Sparkles size={14} className="text-gold-500 animate-pulse" /> FREE SHIPPING TARGET METER
          </span>
          <span className="text-slate-800 dark:text-zinc-200">
            {hasFreeShipping ? 'UNLOCKED! 🎉' : `₹${subtotal} / ₹1000`}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3.5 bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden border border-slate-200/50 dark:border-zinc-800 p-[2px]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${freeShippingPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-gold-500 to-amber-500 rounded-full"
          />
        </div>

        <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mt-0.5">
          <span>
            {hasFreeShipping 
              ? 'Congratulations! Your order qualifies for Complimentary Premium Delivery.' 
              : `Add ₹${remainingToFreeShipping} more to unlock free delivery.`
            }
          </span>
          {!hasFreeShipping && (
            <span className="text-gold-600 dark:text-gold-500 font-bold uppercase tracking-wider">
              Free delivery threshold: ₹1000
            </span>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Cart Items List (8 cols) */}
        <main className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.product}
                  layout
                  exit={{ opacity: 0, x: -20 }}
                  className="glass p-4 rounded-2xl border border-slate-100/60 dark:border-zinc-800 flex gap-4 items-center justify-between shadow-sm hover:shadow-md transition-shadow group relative"
                >
                  {/* Product Details */}
                  <div className="flex gap-4 items-center flex-1">
                    <div className="w-16 h-16 rounded-xl bg-slate-150 overflow-hidden border flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-bold">Image</div>
                      )}
                    </div>

                    <div className="flex flex-col gap-0.5 truncate max-w-[200px] sm:max-w-xs">
                      <Link to={`/product/${item.product}`} className="text-xs font-bold text-slate-800 dark:text-zinc-200 hover:text-gold-600 transition-colors truncate">
                        {item.name}
                      </Link>
                      <span className="text-[11px] text-slate-500 dark:text-zinc-450 font-black">₹{item.price} each</span>
                    </div>
                  </div>

                  {/* Quantity Modifier */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQtyChange(item.product, item.qty, -1)}
                      className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center justify-center text-slate-500"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="text-xs font-bold w-6 text-center text-slate-800 dark:text-zinc-200">{item.qty}</span>
                    <button
                      onClick={() => handleQtyChange(item.product, item.qty, 1)}
                      className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center justify-center text-slate-500"
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                  {/* Total Price */}
                  <span className="text-xs font-black text-slate-850 dark:text-zinc-150 w-20 text-right">
                    ₹{item.price * item.qty}
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.product)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button onClick={() => dispatch(clearCart())} className="text-[10px] uppercase font-black tracking-widest text-slate-400 hover:text-slate-600 transition-colors w-fit">
            Clear Shopping Bag
          </button>
        </main>

        {/* Right Side: Dynamic Upsells & Cart Summary (4 cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Threshold upsell items panel */}
          {!hasFreeShipping && recommendations.length > 0 && (
            <div className="glass p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 flex flex-col gap-4 shadow-sm">
              <span className="text-[10px] font-black uppercase text-gold-650 tracking-wider flex items-center gap-1">
                <Sparkles size={12} className="animate-pulse" /> Add These to Reach Free Shipping
              </span>
              
              <div className="flex flex-col gap-3">
                {recommendations.map(prod => (
                  <div key={prod._id} className="flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50 p-2.5 rounded-xl border border-slate-100/50">
                    <div className="flex flex-col truncate max-w-[160px]">
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-350 truncate">{prod.name}</span>
                      <span className="text-[10px] font-semibold text-slate-500">₹{prod.price}</span>
                    </div>

                    <button
                      onClick={() => {
                        dispatch(addToCart({
                          product: prod._id,
                          name: prod.name,
                          price: prod.price,
                          image: prod.image,
                          qty: 1
                        }));
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-lg flex items-center justify-center transition-all shadow"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cart Summary */}
          <div className="glass p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 flex flex-col gap-4 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-850 dark:text-zinc-200">
              Cart Balance Sheet
            </h3>

            <div className="flex flex-col gap-2.5 border-b border-slate-100 dark:border-zinc-800 pb-4 text-xs font-medium text-slate-650 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-800 dark:text-zinc-250">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping fee:</span>
                <span className="font-bold text-slate-800 dark:text-zinc-250">
                  {hasFreeShipping ? 'Complimentary' : '₹100'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm font-black text-slate-850 dark:text-zinc-150">
              <span>Total Price:</span>
              <span>₹{subtotal + (hasFreeShipping ? 0 : 100)}</span>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider hover:opacity-90 flex items-center justify-center gap-1.5 shadow"
            >
              PROCEED TO SECURE CHECKOUT <ArrowRight size={14} />
            </Link>
          </div>

        </aside>

      </div>
    </div>
  );
};

export default Cart;
