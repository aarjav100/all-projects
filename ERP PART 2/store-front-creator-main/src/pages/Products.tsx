import { useState } from 'react';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import Cart from '../components/Cart';
import { Product, CartItem } from '../types/shopping';

// Expanded sample product data (same as Index)
const sampleProducts: Product[] = [
  // Electronics & Digital
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
    category: "Electronics",
    description: "High-quality wireless headphones with noise cancellation",
    rating: 4.5,
    inStock: true
  },
  {
    id: 4,
    name: "Smart Watch Series X",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "Electronics",
    description: "Advanced smartwatch with health monitoring features",
    rating: 4.6,
    inStock: true
  },
  {
    id: 7,
    name: "Gaming Mechanical Keyboard",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop",
    category: "Electronics",
    description: "RGB backlit mechanical keyboard for gaming enthusiasts",
    rating: 4.7,
    inStock: true
  },
  {
    id: 8,
    name: "Wireless Gaming Mouse",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop",
    category: "Electronics",
    description: "High-precision wireless gaming mouse with customizable buttons",
    rating: 4.4,
    inStock: true
  },
  {
    id: 9,
    name: "4K Webcam HD",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop",
    category: "Digital",
    description: "Ultra HD webcam for streaming and video calls",
    rating: 4.3,
    inStock: true
  },
  {
    id: 10,
    name: "Portable SSD 1TB",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop",
    category: "Digital",
    description: "Fast portable external SSD with USB-C connectivity",
    rating: 4.8,
    inStock: true
  },
  {
    id: 11,
    name: "Wireless Earbuds Pro",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop",
    category: "Electronics",
    description: "Premium wireless earbuds with active noise cancellation",
    rating: 4.6,
    inStock: true
  },
  
  // Men's Clothing
  {
    id: 12,
    name: "Men's Cotton T-Shirt",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop",
    category: "Men's Clothing",
    description: "Comfortable 100% cotton t-shirt in various colors",
    rating: 4.2,
    inStock: true
  },
  {
    id: 13,
    name: "Men's Denim Jeans",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop",
    category: "Men's Clothing",
    description: "Classic fit denim jeans with premium quality",
    rating: 4.5,
    inStock: true
  },
  {
    id: 14,
    name: "Men's Formal Shirt",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop",
    category: "Men's Clothing",
    description: "Professional dress shirt for office and formal occasions",
    rating: 4.4,
    inStock: true
  },
  {
    id: 15,
    name: "Men's Sneakers",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop",
    category: "Men's Clothing",
    description: "Comfortable athletic sneakers for daily wear",
    rating: 4.3,
    inStock: true
  },

  // Women's Clothing
  {
    id: 16,
    name: "Women's Summer Dress",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop",
    category: "Women's Clothing",
    description: "Elegant floral summer dress perfect for any occasion",
    rating: 4.6,
    inStock: true
  },
  {
    id: 17,
    name: "Women's Yoga Pants",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop",
    category: "Women's Clothing",
    description: "High-waisted yoga pants with moisture-wicking fabric",
    rating: 4.7,
    inStock: true
  },
  {
    id: 18,
    name: "Women's Blazer",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop",
    category: "Women's Clothing",
    description: "Professional blazer for office and business meetings",
    rating: 4.5,
    inStock: true
  },
  {
    id: 19,
    name: "Women's Athletic Shoes",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop",
    category: "Women's Clothing",
    description: "Lightweight running shoes with superior cushioning",
    rating: 4.4,
    inStock: true
  },

  // Automobile Parts
  {
    id: 20,
    name: "Car Air Filter",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop",
    category: "Automobile Parts",
    description: "High-efficiency engine air filter for better performance",
    rating: 4.3,
    inStock: true
  },
  {
    id: 21,
    name: "Brake Pads Set",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop",
    category: "Automobile Parts",
    description: "Premium ceramic brake pads for enhanced stopping power",
    rating: 4.6,
    inStock: true
  },
  {
    id: 22,
    name: "Car Battery 12V",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop",
    category: "Automobile Parts",
    description: "Long-lasting automotive battery with 3-year warranty",
    rating: 4.5,
    inStock: true
  },
  {
    id: 23,
    name: "LED Headlight Bulbs",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop",
    category: "Automobile Parts",
    description: "Energy-efficient LED headlight upgrade kit",
    rating: 4.4,
    inStock: true
  },
  {
    id: 24,
    name: "Motor Oil 5W-30",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop",
    category: "Automobile Parts",
    description: "Premium synthetic motor oil for engine protection",
    rating: 4.7,
    inStock: true
  },

  // Furniture (existing)
  {
    id: 2,
    name: "Modern Living Room Sofa",
    price: 899.99,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop",
    category: "Furniture",
    description: "Comfortable and stylish sofa perfect for any living space",
    rating: 4.8,
    inStock: true
  },
  {
    id: 5,
    name: "Designer Coffee Table",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop",
    category: "Furniture",
    description: "Elegant coffee table with modern design",
    rating: 4.4,
    inStock: false
  },

  // Pet Supplies (existing)
  {
    id: 3,
    name: "Premium Cat Bed",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop",
    category: "Pet Supplies",
    description: "Cozy and comfortable bed for your feline friend",
    rating: 4.3,
    inStock: true
  },
  {
    id: 6,
    name: "Luxury Pet Carrier",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop",
    category: "Pet Supplies",
    description: "Premium carrier for safe and comfortable pet travel",
    rating: 4.7,
    inStock: true
  }
];

const Products = () => {
  const [products] = useState<Product[]>(sampleProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const updateCartItem = (id: number, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">All Products</h1>
          <p className="text-xl text-muted-foreground mb-6">Browse our complete product catalog</p>
          
          {/* Filters and Sort */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>

        <ProductGrid 
          products={sortedProducts} 
          onAddToCart={addToCart}
        />
      </main>

      <Cart
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateItem={updateCartItem}
        onRemoveItem={removeFromCart}
      />
    </div>
  );
};

export default Products;
