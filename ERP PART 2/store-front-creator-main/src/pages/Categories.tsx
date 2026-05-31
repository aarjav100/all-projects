
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Product, CartItem } from '../types/shopping';
import { Package, Sofa, Heart } from 'lucide-react';

const Categories = () => {
  const [cartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const categories = [
    {
      name: 'Electronics',
      icon: Package,
      description: 'Latest gadgets and electronic devices',
      productCount: 25,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop'
    },
    {
      name: 'Furniture',
      icon: Sofa,
      description: 'Modern and comfortable home furniture',
      productCount: 18,
      image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop'
    },
    {
      name: 'Pet Supplies',
      icon: Heart,
      description: 'Everything your pets need to stay happy',
      productCount: 12,
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop'
    }
  ];

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => {}}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Shop by Category</h1>
          <p className="text-xl text-muted-foreground mb-6">Find exactly what you're looking for</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className="group cursor-pointer bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                <div className="absolute top-4 left-4">
                  <category.icon className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {category.productCount} products
                  </span>
                  <span className="text-primary font-medium group-hover:underline">
                    Browse →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Categories Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Why Shop by Category?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Organized Shopping</h3>
              <p className="text-muted-foreground">Find products quickly with our well-organized categories</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sofa className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Curated Selection</h3>
              <p className="text-muted-foreground">Each category features hand-picked, quality products</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Best Deals</h3>
              <p className="text-muted-foreground">Discover exclusive offers within each category</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Categories;
