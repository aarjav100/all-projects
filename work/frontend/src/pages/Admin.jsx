import React, { useState, useEffect } from 'react';
import { ShieldCheck, BarChart3, Users, DollarSign, Package, ShoppingBag, PlusCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Admin = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Product insertion form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Laptops');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('10');
  const [specsInput, setSpecsInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchAdminStats();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      setSuccessMsg('');
      
      // Parse specs: "Processor: Ryzen 9, RAM: 16GB" -> [{name: "Processor", value: "Ryzen 9"}]
      const specifications = specsInput.split(',').map(pair => {
        const [k, v] = pair.split(':');
        if (k && v) {
          return { name: k.trim(), value: v.trim() };
        }
        return null;
      }).filter(Boolean);

      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

      await axios.post('/api/products', {
        name,
        description,
        price: Number(price),
        category,
        image,
        stock: Number(stock),
        specifications,
        tags
      });

      setSuccessMsg('Product added successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setImage('');
      setStock('10');
      setSpecsInput('');
      setTagsInput('');
      fetchAdminStats(); // refresh database counts
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add product.');
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="text-center py-16 glass rounded-3xl flex flex-col items-center gap-4 border border-slate-100 dark:border-zinc-800 max-w-xl mx-auto my-8 shadow-sm p-8 text-slate-800 dark:text-zinc-100">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-450">
          <ShieldCheck size={28} />
        </div>
        <div className="flex flex-col gap-1.5 mt-2">
          <h2 className="text-base font-extrabold text-slate-800 dark:text-zinc-200">Access Denied</h2>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
            Administrator privileges are required to view dashboard statistics and insert new catalog items.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse py-8">
        <div className="h-8 bg-slate-200 dark:bg-zinc-800 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-28 bg-slate-200 dark:bg-zinc-800 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="flex flex-col gap-8 pb-16">
      <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-zinc-200">
        <ShieldCheck size={18} className="text-gold-600" /> Luxe Systems Admin Dashboard
      </h2>

      {/* Analytics counter widgets */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        
        {/* Total Revenue */}
        <div className="glass p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex gap-4 items-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-500 flex items-center justify-center flex-shrink-0">
            <DollarSign size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-450 uppercase">Total Sales Revenue</span>
            <span className="text-xl font-black text-slate-850 dark:text-zinc-150">₹{stats.totalRevenue}</span>
          </div>
        </div>

        {/* Total Users */}
        <div className="glass p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex gap-4 items-center">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-500 flex items-center justify-center flex-shrink-0">
            <Users size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-450 uppercase">Registered Customers</span>
            <span className="text-xl font-black text-slate-850 dark:text-zinc-150">{stats.totalUsers} users</span>
          </div>
        </div>

        {/* Total Products */}
        <div className="glass p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex gap-4 items-center">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/20 text-amber-600 dark:text-amber-500 flex items-center justify-center flex-shrink-0">
            <Package size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-450 uppercase">Active Catalog Items</span>
            <span className="text-xl font-black text-slate-850 dark:text-zinc-150">{stats.totalProducts} items</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="glass p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex gap-4 items-center">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-500 flex items-center justify-center flex-shrink-0">
            <ShoppingBag size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-450 uppercase">Checkouts processed</span>
            <span className="text-xl font-black text-slate-850 dark:text-zinc-150">{stats.totalOrders} orders</span>
          </div>
        </div>

      </section>

      {/* Product insertion form and inventories lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Product Addition (5 cols) */}
        <div className="lg:col-span-5 glass p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 flex flex-col gap-4">
          <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
            <PlusCircle size={15} className="text-gold-600" /> Insert New Catalog Product
          </h3>

          <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Product Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g. Lumina Pro Headphones"
                className="bg-slate-100 dark:bg-zinc-900 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-gold-500 text-slate-800 dark:text-zinc-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-450 uppercase">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="3499"
                  className="bg-slate-100 dark:bg-zinc-900 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-gold-500 text-slate-800 dark:text-zinc-100"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-450 uppercase">Stock Inventory</label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="10"
                  className="bg-slate-100 dark:bg-zinc-900 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-gold-500 text-slate-800 dark:text-zinc-100"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Product Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-slate-100 dark:bg-zinc-900 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none text-slate-800 dark:text-zinc-100"
              >
                {['Laptops', 'Footwear', 'Mobiles', 'Apparel', 'Accessories'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Product Image URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="http://example.com/img.jpg"
                className="bg-slate-100 dark:bg-zinc-900 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-gold-500 text-slate-800 dark:text-zinc-100"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Specifications (Key: Value, Comma separated)</label>
              <input
                type="text"
                value={specsInput}
                onChange={(e) => setSpecsInput(e.target.value)}
                placeholder="Processor: Intel i7, RAM: 16GB"
                className="bg-slate-100 dark:bg-zinc-900 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-gold-500 text-slate-800 dark:text-zinc-100"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Search Tags (Comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="gaming, wireless, sports"
                className="bg-slate-100 dark:bg-zinc-900 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-gold-500 text-slate-800 dark:text-zinc-100"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Description</label>
              <textarea
                rows="2"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the product..."
                className="bg-slate-100 dark:bg-zinc-900 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-gold-500 text-slate-800 dark:text-zinc-100"
              />
            </div>

            {successMsg && <span className="text-xs font-bold text-emerald-500 flex items-center gap-1"><CheckCircle size={12} /> {successMsg}</span>}

            <button type="submit" className="w-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:opacity-90">
              CREATE PRODUCT
            </button>
          </form>
        </div>

        {/* Right: Master Orders Ledger (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <h3 className="text-xs font-black text-slate-850 dark:text-zinc-250 uppercase tracking-widest flex items-center gap-1.5">
            <BarChart3 size={15} className="text-gold-600" /> Recent Sales Invoices Ledger
          </h3>

          <div className="glass rounded-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden shadow-sm">
            {stats.recentOrders.length === 0 ? (
              <p className="text-xs text-slate-400 italic p-6 text-center">No transactions completed yet.</p>
            ) : (
              <table className="w-full text-left text-xs font-medium border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-100 text-[10px] text-slate-450 uppercase font-black tracking-wider">
                    <th className="p-4">Invoice ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Paid Total</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((ord) => (
                    <tr key={ord._id} className="border-b border-slate-105/50 dark:border-zinc-800/50 hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-[10px] truncate max-w-[100px]">
                        {ord._id}
                      </td>
                      <td className="p-4 text-slate-700 dark:text-zinc-350">
                        {ord.user ? ord.user.name : 'Unknown User'}
                      </td>
                      <td className="p-4 font-black">
                        ₹{ord.totalPrice}
                      </td>
                      <td className="p-4 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          ord.isPaid 
                            ? 'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-500' 
                            : 'bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-500'
                        }`}>
                          {ord.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;
