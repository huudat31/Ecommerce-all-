"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Search,
  User,
  Heart,
  Star,
  Plus,
  Minus,
  Filter,
  Grid,
  List,
  Truck,
  Shield,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Package,
  CreditCard,
  Award,
  Users,
  TrendingUp,
  Eye,
  ShoppingBag
} from "lucide-react";

// Mock data
const mockProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 32990000,
    originalPrice: 34990000,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400",
    rating: 4.8,
    reviews: 1245,
    category: "Điện thoại",
    brand: "Apple",
    inStock: true,
    discount: 6,
    description: "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP cải tiến"
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    price: 28990000,
    originalPrice: 31990000,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
    rating: 4.7,
    reviews: 892,
    category: "Điện thoại",
    brand: "Samsung",
    inStock: true,
    discount: 9,
    description: "Galaxy S24 Ultra với S Pen tích hợp, camera zoom 100x"
  },
  {
    id: 3,
    name: "MacBook Air M3",
    price: 27990000,
    originalPrice: 29990000,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
    rating: 4.9,
    reviews: 567,
    category: "Laptop",
    brand: "Apple",
    inStock: true,
    discount: 7,
    description: "MacBook Air M3 siêu mỏng nhẹ, hiệu năng vượt trội"
  },
  {
    id: 4,
    name: "iPad Pro 12.9",
    price: 24990000,
    originalPrice: 26990000,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    rating: 4.6,
    reviews: 423,
    category: "Tablet",
    brand: "Apple",
    inStock: false,
    discount: 7,
    description: "iPad Pro 12.9 inch với màn hình Liquid Retina XDR"
  },
  {
    id: 5,
    name: "AirPods Pro 2",
    price: 6490000,
    originalPrice: 6990000,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
    rating: 4.8,
    reviews: 1876,
    category: "Phụ kiện",
    brand: "Apple",
    inStock: true,
    discount: 7,
    description: "AirPods Pro 2 với tính năng chống ồn chủ động"
  },
  {
    id: 6,
    name: "Dell XPS 13",
    price: 22990000,
    originalPrice: 24990000,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    rating: 4.5,
    reviews: 234,
    category: "Laptop",
    brand: "Dell",
    inStock: true,
    discount: 8,
    description: "Dell XPS 13 với thiết kế cao cấp, màn hình InfinityEdge"
  }
];

const categories = [
  { id: "all", name: "Tất cả", count: 156 },
  { id: "phone", name: "Điện thoại", count: 45 },
  { id: "laptop", name: "Laptop", count: 32 },
  { id: "tablet", name: "Tablet", count: 28 },
  { id: "accessory", name: "Phụ kiện", count: 51 }
];

const heroSlides = [
  {
    id: 1,
    title: "iPhone 15 Series",
    subtitle: "Công nghệ tiên tiến nhất",
    description: "Trải nghiệm iPhone 15 Pro Max với chip A17 Pro",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800",
    cta: "Khám phá ngay"
  },
  {
    id: 2,
    title: "MacBook Air M3",
    subtitle: "Hiệu năng vượt trội",
    description: "Siêu mỏng nhẹ, pin trâu, hiệu năng đỉnh cao",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
    cta: "Mua ngay"
  }
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function UserHomePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Auto slide hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const toggleWishlist = (productId: number) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" ||
      product.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between py-2 text-sm border-b border-gray-100">
            <div className="flex items-center space-x-4 text-gray-600">
              <span className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                Hotline: 1900-xxxx
              </span>
              <span className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                support@shop.com
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Miễn phí vận chuyển đơn từ 500K</span>
              <div className="flex space-x-2">
                <Facebook className="h-4 w-4 text-blue-600 cursor-pointer" />
                <Twitter className="h-4 w-4 text-blue-400 cursor-pointer" />
                <Instagram className="h-4 w-4 text-pink-600 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Main header */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden mr-4 p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">TechShop</h1>
                  <p className="text-xs text-gray-600">Công nghệ cho mọi nhà</p>
                </div>
              </div>
            </div>

            {/* Search bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Heart className="h-6 w-6 text-gray-600" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <User className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex space-x-8 py-4 border-t border-gray-100">
            <a href="#" className="text-blue-600 font-medium hover:text-blue-700">Trang chủ</a>
            <a href="#products" className="text-gray-600 hover:text-gray-900">Sản phẩm</a>
            <a href="#about" className="text-gray-600 hover:text-gray-900">Giới thiệu</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900">Liên hệ</a>
            <a href="#" className="text-red-600 hover:text-red-700">Khuyến mãi</a>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-lg font-semibold">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="p-4 space-y-4">
              <a href="#" className="block text-blue-600 font-medium">Trang chủ</a>
              <a href="#products" className="block text-gray-600">Sản phẩm</a>
              <a href="#about" className="block text-gray-600">Giới thiệu</a>
              <a href="#contact" className="block text-gray-600">Liên hệ</a>
              <a href="#" className="block text-red-600">Khuyến mãi</a>
            </nav>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-xl mb-4 text-blue-100">
                {heroSlides[currentSlide].subtitle}
              </p>
              <p className="text-lg mb-8 text-blue-50">
                {heroSlides[currentSlide].description}
              </p>
              <div className="flex space-x-4">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  {heroSlides[currentSlide].cta}
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  Tìm hiểu thêm
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroSlides[currentSlide].image}
                alt={heroSlides[currentSlide].title}
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Miễn phí vận chuyển</h3>
              <p className="text-gray-600">Đơn hàng từ 500.000đ</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Bảo hành chính hãng</h3>
              <p className="text-gray-600">Đầy đủ tem MAC, CO/CQ</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Đổi trả 30 ngày</h3>
              <p className="text-gray-600">Miễn phí đổi trả trong 30 ngày</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Chất lượng đảm bảo</h3>
              <p className="text-gray-600">Sản phẩm chính hãng 100%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sản phẩm nổi bật</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá bộ sưu tập các sản phẩm công nghệ mới nhất với chất lượng cao và giá cả hợp lý
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popular">Phổ biến</option>
                <option value="price-low">Giá thấp đến cao</option>
                <option value="price-high">Giá cao đến thấp</option>
                <option value="newest">Mới nhất</option>
              </select>

              <div className="flex bg-white border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-6 ${viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
            }`}>
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {product.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                      -{product.discount}%
                    </span>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">Hết hàng</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex flex-col space-y-2">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-2 rounded-full ${wishlist.includes(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openProductModal(product)}
                      className="p-2 bg-white rounded-full text-gray-600 hover:bg-gray-100"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>

                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {product.rating} ({product.reviews} đánh giá)
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-lg font-bold text-blue-600">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">{product.brand}</span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Về TechShop</h2>
              <p className="text-gray-600 mb-6">
                TechShop là cửa hàng công nghệ hàng đầu tại Việt Nam, chuyên cung cấp các sản phẩm điện tử,
                điện thoại, laptop và phụ kiện công nghệ chính hãng với giá cả hợp lý.
              </p>
              <p className="text-gray-600 mb-6">
                Với hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ, chúng tôi cam kết mang đến cho khách hàng
                những sản phẩm chất lượng cao nhất cùng với dịch vụ chăm sóc khách hàng tận tâm.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">50K+</div>
                  <div className="text-gray-600">Khách hàng</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">1000+</div>
                  <div className="text-gray-600">Sản phẩm</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">10+</div>
                  <div className="text-gray-600">Năm kinh nghiệm</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">100%</div>
                  <div className="text-gray-600">Hàng chính hãng</div>
                </div>
              </div>
            </div>
            <div>
              <img src="/about.jpg" alt="About" className="w-full rounded-lg" />
            </div>
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Lĩnh vụ</h2>
              <p className="text-gray-600 mb-6">
                Với hơn 10 năm kinh nghiệm trong lĩnh vụ, chúng tôi cam kết mang đến cho khách hàng
                những sản phẩm chất lượng cao nhất cùng với dịch vụ chăm sốc khách hàng tận tâm.
              </p>
              <p className="text-gray-600 mb-6">
                Với hơn 10 năm kinh nghiệm trong lĩnh vụ, chúng tôi cam kết mang đến cho khách hàng
                những sản phẩm chất lượng cao nhất cùng với dịch vụ chăm sốc khách hàng tận tâm.
              </p>
              <p className="text-gray-600 mb-6">
                Với hơn 10 năm kinh nghiệm trong lĩnh vụ, chúng tôi cam kết mang đến cho khách hàng
                những sản phẩm chất lượng cao nhất cùng với dịch vụ chame sốc khách hàng tán tâm.
              </p>
            </div>
            <div>
              <img src="/contact.jpg" alt="Contact" className="w-full rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <p className="text-center">&copy; 2023 TechShop. All rights reserved.</p>
        </div>
      </footer>

      {/* Product Modal
      {showProductModal && selectedProduct && (
        // <ProductModal
        //   product={selectedProduct}
        //   onClose={() => setShowProductModal(false)}
        // />
      )} */}
    </div>
  );
}