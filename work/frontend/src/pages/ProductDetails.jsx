import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, ThumbsUp, Sparkles, Plus, CheckCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import ReviewSummary from '../components/ReviewSummary';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  // Submit review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [imagesInput, setImagesInput] = useState('');
  const [videosInput, setVideosInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Fetch product data and reviews
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const prodRes = await axios.get(`/api/products/${id}`);
        setProduct(prodRes.data);

        const revRes = await axios.get(`/api/products/${id}/reviews?sortBy=${sortBy}`);
        setReviews(revRes.data);
      } catch (err) {
        console.error('Failed to load product information', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, sortBy]);

  // Handle Review Submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setSubmittingReview(true);
      setSubmitSuccess('');
      setSubmitError('');

      const parsedImages = imagesInput.split(',').map(img => img.trim()).filter(Boolean);
      const parsedVideos = videosInput.split(',').map(vid => vid.trim()).filter(Boolean);

      const res = await axios.post(`/api/products/${id}/reviews`, {
        rating,
        comment,
        images: parsedImages,
        videos: parsedVideos
      });

      setSubmitSuccess(res.data.message);
      setComment('');
      setImagesInput('');
      setVideosInput('');
      
      // Update local reviews list
      const updatedRevs = await axios.get(`/api/products/${id}/reviews?sortBy=${sortBy}`);
      setReviews(updatedRevs.data);
      
      // Update rating counts in header
      setProduct(prev => ({
        ...prev,
        rating: res.data.productRating,
        numReviews: res.data.productNumReviews
      }));
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Review submission failed.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Upvote Review
  const handleVote = async (reviewId, voteType) => {
    try {
      const res = await axios.post(`/api/reviews/${reviewId}/helpful`, { type: voteType });
      
      // Sync helpful counts instantly in local state
      setReviews(prev => prev.map(rev => {
        if (rev._id === reviewId) {
          return {
            ...rev,
            helpfulVotes: res.data.helpfulVotes,
            unhelpfulVotes: res.data.unhelpfulVotes
          };
        }
        return rev;
      }));
    } catch (err) {
      alert(err.response?.data?.error || 'Already voted or unauthorized.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse py-8">
        <div className="h-8 bg-slate-200 dark:bg-zinc-800 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-slate-200 dark:bg-zinc-800 rounded-3xl"></div>
          <div className="flex flex-col gap-4">
            <div className="h-6 bg-slate-200 dark:bg-zinc-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/2"></div>
            <div className="h-20 bg-slate-200 dark:bg-zinc-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12 glass rounded-2xl flex flex-col gap-3">
        <h2 className="text-lg font-bold text-slate-800">Product not found.</h2>
        <Link to="/" className="text-gold-600 font-bold hover:underline">Return to home</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 pb-16">
      {/* Return home link */}
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300 transition-colors">
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
      </div>

      {/* Main product specs block */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Image View */}
        <div className="glass p-4 rounded-3xl overflow-hidden border border-slate-100 dark:border-zinc-800 aspect-square flex items-center justify-center bg-slate-50/50 max-h-[520px]">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-2xl shadow-sm" />
          ) : (
            <span className="text-slate-400">No Image Available</span>
          )}
        </div>

        {/* Right Info View */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider w-fit">
              {product.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold font-serif text-slate-800 dark:text-zinc-150 leading-tight">
              {product.name}
            </h1>
            
            {/* Rating counts */}
            <div className="flex items-center gap-1.5 mt-1">
              <span className="flex items-center text-gold-500 font-black text-xs gap-0.5">
                <Star size={13} className="fill-current" /> {product.rating}
              </span>
              <span className="text-xs text-slate-400 dark:text-zinc-500">
                ({product.numReviews} verified custom reviews)
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
            {product.description}
          </p>

          <div className="flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-450 uppercase">Retail Price</span>
              <span className="text-2xl font-black text-slate-900 dark:text-zinc-100">₹{product.price}</span>
            </div>
            
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
              className="bg-slate-900 dark:bg-zinc-100 hover:bg-slate-800 text-white dark:text-slate-900 px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow"
            >
              <Plus size={14} /> Add to Shopping Bag
            </button>
          </div>

          {/* Specifications Matrix */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">PRODUCT SPECIFICATIONS</span>
            <div className="glass rounded-2xl overflow-hidden border border-slate-100 dark:border-zinc-800">
              {product.specifications && product.specifications.map((spec, i) => (
                <div key={i} className="flex justify-between p-3.5 border-b border-slate-100/50 dark:border-zinc-800 last:border-b-0 text-xs font-medium">
                  <span className="font-bold text-slate-700 dark:text-zinc-350">{spec.name}</span>
                  <span className="text-slate-600 dark:text-zinc-400 text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic AI reviews summary block */}
      <section className="flex flex-col gap-4">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">AI FEEDBACK SUMMARY</h3>
        <ReviewSummary productId={product._id} />
      </section>

      {/* Customer Reviews and submissions */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Submit review form (5 cols) */}
        <div className="lg:col-span-5 glass p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase text-slate-800 dark:text-zinc-200 tracking-wider">
            Submit Customer Review
          </h3>

          {!user ? (
            <p className="text-xs text-rose-500 font-semibold italic">
              Please sign in to submit a verified purchase review.
            </p>
          ) : (
            <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
              {/* Rating selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase">Star Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-gold-500 focus:outline-none transition-transform active:scale-95"
                    >
                      <Star size={20} className={star <= rating ? 'fill-current' : ''} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase">Written Comment</label>
                <textarea
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What was your experience with the build quality, performance, or styling?"
                  className="w-full bg-slate-100 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-gold-500 text-slate-800 dark:text-zinc-100"
                  required
                />
              </div>

              {/* Image Attachments */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase">Product Image URLs (Comma separated)</label>
                <input
                  type="text"
                  placeholder="E.g. http://example.com/img1.jpg, http://example.com/img2.jpg"
                  value={imagesInput}
                  onChange={(e) => setImagesInput(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-gold-500 text-slate-800 dark:text-zinc-100"
                />
              </div>

              {/* Video Attachments */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase">Product Video URLs (Comma separated)</label>
                <input
                  type="text"
                  placeholder="E.g. http://example.com/vid1.mp4"
                  value={videosInput}
                  onChange={(e) => setVideosInput(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-gold-500 text-slate-800 dark:text-zinc-100"
                />
              </div>

              {submitError && <span className="text-[11px] text-rose-500 font-bold">{submitError}</span>}
              {submitSuccess && <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-1"><CheckCircle size={12} /> {submitSuccess}</span>}

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles size={14} /> {submittingReview ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Reviews Display Listing (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
              Verified Customer Ledger ({reviews.length})
            </h3>
            
            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border border-slate-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider rounded-lg p-1.5 focus:outline-none text-slate-700 dark:text-zinc-300"
            >
              <option value="newest">Newest Reviews</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>

          <div className="flex flex-col gap-4">
            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No reviews submitted yet for this premium product.</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="glass p-5 rounded-2xl border border-slate-100/60 dark:border-zinc-800 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                  
                  {/* Review Header info */}
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-zinc-250">{rev.userName}</span>
                      <div className="flex items-center gap-1">
                        {/* Rating stars */}
                        <div className="flex text-gold-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={10} className="fill-current" />
                          ))}
                        </div>
                        {rev.verifiedPurchase && (
                          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wide flex items-center gap-0.5">
                            <ShieldCheck size={10} /> Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-750 dark:text-zinc-350 leading-relaxed font-medium">
                    {rev.comment}
                  </p>

                  {/* Image files inside review */}
                  {rev.images && rev.images.length > 0 && (
                    <div className="flex gap-2.5 mt-1 overflow-x-auto py-1">
                      {rev.images.map((img, index) => (
                        <div key={index} className="w-16 h-16 rounded-lg overflow-hidden border border-slate-100/50 flex-shrink-0">
                          <img src={img} alt="review attachment" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Video files inside review */}
                  {rev.videos && rev.videos.length > 0 && (
                    <div className="flex gap-2.5 mt-1 overflow-x-auto py-1">
                      {rev.videos.map((vid, index) => (
                        <div key={index} className="px-3 py-2 bg-slate-100 rounded-lg flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-slate-700 transition-colors font-bold uppercase tracking-wider flex-shrink-0">
                          <i className="fa-solid fa-play text-gold-600"></i> Video Review #{index + 1}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Voting box */}
                  <div className="flex items-center gap-4 mt-1 border-t border-slate-100/50 dark:border-zinc-800 pt-3">
                    <button
                      onClick={() => handleVote(rev._id, 'helpful')}
                      className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-450 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors"
                    >
                      <ThumbsUp size={11} /> Helpful ({rev.helpfulVotes || 0})
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </section>
    </div>
  );
};

export default ProductDetails;
