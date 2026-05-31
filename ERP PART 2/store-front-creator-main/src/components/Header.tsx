
import { Search, ShoppingCart, Menu, X, Home, Package, Grid3X3, Info, Phone, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const Header = ({ cartItemCount, onCartClick, searchTerm, onSearchChange }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navigationItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Products', icon: Package, path: '/products' },
    { name: 'Categories', icon: Grid3X3, path: '/categories' },
    { name: 'About', icon: Info, path: '/about' },
    { name: 'Contact', icon: Phone, path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/"
              className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              BriskKart
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.path)}
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors group"
              >
                <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </form>
          </div>

          {/* Cart, Login and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Login Button */}
            <button
              onClick={handleLoginClick}
              className="hidden md:flex items-center space-x-1 px-3 py-2 text-foreground hover:text-primary transition-colors hover:bg-accent rounded-lg group"
            >
              <LogIn className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Login</span>
            </button>

            <button
              onClick={onCartClick}
              className="relative p-2 text-foreground hover:text-primary transition-colors hover:bg-accent rounded-lg group"
            >
              <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors hover:bg-accent rounded-lg"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </form>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 animate-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.path)}
                  className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors py-3 px-2 hover:bg-accent rounded-lg group"
                >
                  <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
              
              {/* Mobile Login Button */}
              <button
                onClick={handleLoginClick}
                className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors py-3 px-2 hover:bg-accent rounded-lg group border-t border-border mt-2 pt-4"
              >
                <LogIn className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Login</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
