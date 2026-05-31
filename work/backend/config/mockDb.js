const seedProducts = [
  {
    _id: "60c72b2f9b1d8b2bad000001",
    name: "Zenith X1 Gaming Laptop",
    description: "High performance gaming laptop equipped with latest Ryzen 9, 16GB RAM, 1TB SSD, and NVIDIA RTX 4060 graphics card.",
    price: 68900,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=400&q=80",
    stock: 12,
    rating: 4.8,
    numReviews: 2,
    specifications: [
      { name: "Processor", value: "Ryzen 9 7940HS" },
      { name: "Graphics", value: "NVIDIA RTX 4060 (8GB)" },
      { name: "RAM", value: "16GB DDR5" },
      { name: "Storage", value: "1TB NVMe SSD" }
    ],
    tags: ["gaming", "performance", "high-speed"]
  },
  {
    _id: "60c72b2f9b1d8b2bad000002",
    name: "AeroStratus Daily Runners",
    description: "Ultra lightweight running shoes designed for ultimate speed, flexibility, and daily jogging support.",
    price: 2499,
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
    stock: 25,
    rating: 4.5,
    numReviews: 1,
    specifications: [
      { name: "Weight", value: "240g" },
      { name: "Sole Material", value: "Responsive Stratofoam" },
      { name: "Upper Material", value: "Breathable AeroMesh" }
    ],
    tags: ["running", "sports", "jogging", "daily"]
  },
  {
    _id: "60c72b2f9b1d8b2bad000003",
    name: "Lumina Pro Camera Phone",
    description: "Premium smartphone featuring an advanced 108MP camera array, massive 6000mAh battery, and cinematic AMOLED screen.",
    price: 54900,
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
    stock: 18,
    rating: 4.9,
    numReviews: 2,
    specifications: [
      { name: "Camera", value: "108MP + 12MP + 8MP Tri-Lens" },
      { name: "Battery", value: "6000mAh Lithium-Polymer" },
      { name: "Screen", value: "6.7 inch AMOLED (120Hz)" }
    ],
    tags: ["camera", "battery", "smartphone", "flagship"]
  },
  {
    _id: "60c72b2f9b1d8b2bad000004",
    name: "Heritage Cashmere Trench Coat",
    description: "Classic double-breasted cashmere wool blend trench coat perfect for elegant and refined winter fashion.",
    price: 14500,
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80",
    stock: 8,
    rating: 4.7,
    numReviews: 1,
    specifications: [
      { name: "Material", value: "80% Northern Cashmere, 20% Merino Wool" },
      { name: "Buttons", value: "Custom Horn Buttons" }
    ],
    tags: ["winter", "cashmere", "premium", "coat"]
  }
];

const mockReviews = [
  { _id: "rev001", product: "60c72b2f9b1d8b2bad000001", userName: "John Doe", rating: 5, comment: "Excellent battery life and high performance specs. Highly recommended!", verifiedPurchase: true, helpfulVotes: 4, unhelpfulVotes: 0, createdAt: new Date() },
  { _id: "rev002", product: "60c72b2f9b1d8b2bad000001", userName: "Sarah Smith", rating: 4, comment: "Premium build quality but slight heating during extreme gaming sessions. Slow charger included.", verifiedPurchase: true, helpfulVotes: 2, unhelpfulVotes: 0, createdAt: new Date() },
  { _id: "rev003", product: "60c72b2f9b1d8b2bad000002", userName: "David Warner", rating: 4, comment: "Incredible sole comfort and lightweight jogging support. Sleek look.", verifiedPurchase: true, helpfulVotes: 1, unhelpfulVotes: 0, createdAt: new Date() },
  { _id: "rev004", product: "60c72b2f9b1d8b2bad000003", userName: "Emily Watson", rating: 5, comment: "Fantastic 108MP camera! The battery lasts for a full 2 days easily.", verifiedPurchase: true, helpfulVotes: 5, unhelpfulVotes: 0, createdAt: new Date() },
  { _id: "rev005", product: "60c72b2f9b1d8b2bad000003", userName: "Chris Evans", rating: 5, comment: "Screen displays gorgeous colors. Solid value flagship.", verifiedPurchase: true, helpfulVotes: 3, unhelpfulVotes: 0, createdAt: new Date() }
];

module.exports = {
  seedProducts,
  mockReviews
};
