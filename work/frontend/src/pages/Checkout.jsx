import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CreditCard, ShieldCheck, CheckCircle, Gift, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import CheckoutOptimizer from '../components/CheckoutOptimizer';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const dispatch = useDispatch();
  const { items, subtotal, hasFreeShipping } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);

  // Form Fields
  const [address, setAddress] = useState('123 Luxury Avenue');
  const [city, setCity] = useState('Mumbai');
  const [zipcode, setZipcode] = useState('400001');
  const [phone, setPhone] = useState('+91 9876543210');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Points redemption
  const [pointsInput, setPointsInput] = useState(0);
  const [redeemedPoints, setRedeemedPoints] = useState(0);

  // Checkout states
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Spin wheel states
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const [wheelDegree, setWheelDegree] = useState(0);

  const cartTotal = subtotal + (hasFreeShipping ? 0 : 100);

  // Maximum allowed points to redeem (cannot exceed user points or cart total)
  const maxRedeemablePoints = user ? Math.min(user.walletPoints, subtotal) : 0;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to complete checkout.');
      return;
    }

    try {
      setIsPlacingOrder(true);
      
      const orderItems = items.map(item => ({
        product: item.product,
        name: item.name,
        qty: item.qty,
        price: item.price,
        image: item.image
      }));

      // Create Order on backend
      const orderRes = await axios.post('/api/orders', {
        orderItems,
        shippingAddress: { address, city, zipcode, phone },
        paymentMethod,
        pointsToRedeem: Number(pointsInput)
      }, { withCredentials: true });

      const orderObj = orderRes.data.order;

      // Verify payment (auto-verify in our offline sandbox simulation!)
      const verifyRes = await axios.post('/api/orders/verify', {
        orderId: orderObj._id
      }, { withCredentials: true });

      setCreatedOrder(verifyRes.data.order);
      setRedeemedPoints(Number(pointsInput));
      setCheckoutSuccess(true);
      dispatch(clearCart());
      
      // Auto-launch the gamified Spin Wheel after a brief celebration delay!
      setTimeout(() => {
        setShowSpinWheel(true);
      }, 1500);

    } catch (err) {
      alert(err.response?.data?.error || 'Checkout transaction failed.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Perform Lucky Spin wheel trigger
  const handleSpinWheel = async () => {
    if (spinning || !createdOrder) return;

    try {
      setSpinning(true);
      
      // Dynamic visual spin degree calculation
      const extraDegrees = 1440 + Math.floor(Math.random() * 360); // 4 full spins + random offset
      setWheelDegree(extraDegrees);

      // Trigger backend gamification award
      const res = await axios.post('/api/gamification/spin', {
        orderId: createdOrder._id
      }, { withCredentials: true });

      setTimeout(() => {
        setSpinResult(res.data);
        setSpinning(false);
      }, 3000); // 3 seconds spinning animation

    } catch (err) {
      alert('Gamification lucky spin error.');
      setSpinning(false);
    }
  };

  if (items.length === 0 && !checkoutSuccess) {
    return (
      <div className="text-center py-16 flex flex-col gap-3">
        <h2 className="text-lg font-bold text-slate-800">No items to checkout.</h2>
        <Link to="/" className="text-gold-600 font-bold hover:underline">Explore Products</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-16 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-zinc-200">
        <CreditCard size={18} className="text-gold-600" /> Secure Checkout Pipeline
      </h2>

      {/* Success Screens */}
      {checkoutSuccess && (
        <div className="flex flex-col gap-6 text-center py-8 glass rounded-3xl p-8 border border-emerald-500/20 max-w-xl mx-auto my-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-2 animate-bounce">
            <CheckCircle size={36} />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-extrabold font-serif text-slate-800">
              Order Confirmed & Settled!
            </h1>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Your transaction has successfully completed security verifications. A complimentary delivery dispatch has been initialized.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2 text-xs font-semibold text-slate-700 dark:text-zinc-300">
            <div className="flex justify-between">
              <span>Order Reference:</span>
              <span className="font-bold">{createdOrder?._id}</span>
            </div>
            <div className="flex justify-between">
              <span>Loyalty Points Redeemed:</span>
              <span className="text-rose-500 font-bold">-{redeemedPoints} pts</span>
            </div>
            <div className="flex justify-between">
              <span>Loyalty Points Earned:</span>
              <span className="text-emerald-500 font-bold">+{createdOrder?.pointsEarned} pts</span>
            </div>
          </div>

          <Link to="/" className="btn-solid py-2.5 rounded-xl text-xs w-full">
            CONTINUE SHOPPING
          </Link>
        </div>
      )}

      {/* Regular Checkout Form */}
      {!checkoutSuccess && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Input Sheets Form (7 cols) */}
          <form onSubmit={handlePlaceOrder} className="md:col-span-7 flex flex-col gap-6">
            
            {/* Shipping addresses */}
            <div className="glass p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 flex flex-col gap-4">
              <span className="text-[10px] font-black uppercase text-slate-550 tracking-wider">
                1. Delivery Dispatch Address
              </span>
              
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase">Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-gold-500 text-slate-800 dark:text-zinc-100"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-gold-500 text-slate-800 dark:text-zinc-100"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase">Zipcode</label>
                    <input
                      type="text"
                      value={zipcode}
                      onChange={(e) => setZipcode(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-gold-500 text-slate-800 dark:text-zinc-100"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-gold-500 text-slate-800 dark:text-zinc-100"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment options */}
            <div className="glass p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 flex flex-col gap-4">
              <span className="text-[10px] font-black uppercase text-slate-550 tracking-wider">
                2. Select Premium Payment Gate
              </span>
              
              <div className="grid grid-cols-2 gap-3">
                {['UPI', 'Credit Card', 'Debit Card', 'Net Banking'].map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`p-3 rounded-xl border text-xs font-extrabold uppercase tracking-wider flex items-center justify-center transition-all ${
                      paymentMethod === method
                        ? 'border-gold-500 bg-gold-50/10 text-slate-900 dark:text-zinc-100 font-extrabold'
                        : 'border-slate-200 bg-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-900'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Loyalty points rewards wallet usage */}
            <div className="glass p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 flex flex-col gap-4">
              <span className="text-[10px] font-black uppercase text-slate-550 tracking-wider flex items-center gap-1.5">
                <Gift size={12} className="text-gold-600 animate-bounce" /> 3. Luxe Wallet Points Redemption
              </span>

              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span>Available points: <strong className="text-gold-600">{user.walletPoints} pts</strong></span>
                    <span>Max allowed redeemable today: <strong className="text-gold-600">{maxRedeemablePoints} pts</strong></span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      max={maxRedeemablePoints}
                      min={0}
                      value={pointsInput}
                      onChange={(e) => setPointsInput(Math.min(maxRedeemablePoints, Math.max(0, Number(e.target.value))))}
                      placeholder="Redeem points..."
                      className="bg-slate-100 dark:bg-zinc-900 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:border-gold-500 text-slate-800 dark:text-zinc-100 flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => setPointsInput(maxRedeemablePoints)}
                      className="btn-outline px-4 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider"
                    >
                      MAX REDEEM
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-rose-500 font-semibold italic">Please sign in to redeem Luxe Wallet points.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPlacingOrder}
              className="w-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 py-4 rounded-2xl text-xs font-extrabold uppercase tracking-wider hover:opacity-90 flex items-center justify-center gap-1.5 shadow"
            >
              {isPlacingOrder ? 'COMPLETING ENCRYPTED SALE...' : `PLACE SECURE ORDER (₹${cartTotal - pointsInput})`}
            </button>
          </form>

          {/* Right: Checkout Summaries (5 cols) */}
          <aside className="md:col-span-5 flex flex-col gap-6">
            
            {/* AI Cashback Optimizer box */}
            {user && <CheckoutOptimizer cartTotal={cartTotal} />}

            {/* Checkout Invoice Balance */}
            <div className="glass p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 flex flex-col gap-4 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-850 dark:text-zinc-200">
                Checkout Invoice Summary
              </h3>

              <div className="flex flex-col gap-2.5 border-b border-slate-100 dark:border-zinc-800 pb-4 text-xs font-medium text-slate-650 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>Items count:</span>
                  <span className="font-bold text-slate-850">{items.reduce((sum, i) => sum + i.qty, 0)} items</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-850">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping delivery fee:</span>
                  <span className="font-bold text-slate-850">{hasFreeShipping ? 'Complimentary' : '₹100'}</span>
                </div>
                {pointsInput > 0 && (
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>LuxePoints Wallet Discount:</span>
                    <span>-₹{pointsInput}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-sm font-black text-slate-850 dark:text-zinc-150">
                <span>Final amount due:</span>
                <span>₹{cartTotal - pointsInput}</span>
              </div>
            </div>

          </aside>
        </div>
      )}

      {/* Gamified Lucky Spin Modal Wheel */}
      <AnimatePresence>
        {showSpinWheel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass p-8 rounded-3xl max-w-md w-full border border-gold-500/20 flex flex-col gap-6 shadow-2xl relative text-center text-slate-800 dark:text-zinc-100"
            >
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black tracking-widest text-gold-600 uppercase flex items-center gap-1 justify-center animate-pulse">
                  <Sparkles size={12} /> Post-Purchase Lucky Spin
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold font-serif">Spin the Lucky Wheel!</h2>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Every LUXE transaction qualifies for a lucky spin wheel payout. Turn the wheel to earn dynamic bonus Luxe Points in your wallet!
                </p>
              </div>

              {/* Graphical Rotating Wheel */}
              <div className="relative w-48 h-48 mx-auto my-4 border-[6px] border-slate-900 rounded-full flex items-center justify-center shadow-lg bg-slate-100 overflow-hidden">
                {/* Pointer indicator */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-rose-500 rounded-b-md z-20 shadow"></div>

                <motion.div
                  style={{ rotate: wheelDegree }}
                  transition={{ duration: 3, ease: 'easeOut' }}
                  className="w-full h-full rounded-full flex items-center justify-center relative bg-gradient-to-tr from-gold-500 via-amber-500 to-yellow-400"
                >
                  {/* Visual segments */}
                  <div className="absolute w-full h-full flex items-center justify-center text-[11px] font-black text-slate-900">
                    <span className="absolute rotate-0 translate-y-[-60px]">50</span>
                    <span className="absolute rotate-72 translate-y-[-60px]">100</span>
                    <span className="absolute rotate-144 translate-y-[-60px]">200</span>
                    <span className="absolute rotate-216 translate-y-[-60px]">500</span>
                    <span className="absolute rotate-288 translate-y-[-60px]">1000</span>
                  </div>
                </motion.div>
                
                {/* Spin Trigger Center */}
                <button
                  onClick={handleSpinWheel}
                  disabled={spinning || spinResult}
                  className="absolute w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black uppercase hover:scale-105 transition-transform z-10 border border-white/20 shadow-md"
                >
                  {spinning ? 'SPINNING' : 'SPIN'}
                </button>
              </div>

              {/* Spin result outputs */}
              <AnimatePresence>
                {spinResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-emerald-50/20 dark:bg-emerald-950/5 border border-emerald-500/20 flex flex-col gap-1 items-center"
                  >
                    <CheckCircle size={28} className="text-emerald-500 mb-1" />
                    <span className="text-sm font-extrabold text-slate-800 dark:text-zinc-100">
                      You won {spinResult.pointsWon} Luxe Points!
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Points have been credited successfully to your wallet balance.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {spinResult ? (
                <button
                  onClick={() => setShowSpinWheel(false)}
                  className="w-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 py-3 rounded-2xl text-xs font-black uppercase tracking-wider hover:opacity-90"
                >
                  CLOSE & RETRIEVE STATUS
                </button>
              ) : (
                <button
                  onClick={() => setShowSpinWheel(false)}
                  disabled={spinning}
                  className="text-xs text-slate-450 hover:underline disabled:opacity-50"
                >
                  Skip Spin
                </button>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
