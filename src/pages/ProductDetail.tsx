
import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { toast } from "sonner";

const ProductDetail = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const brandName = location.state?.brandName || 'Brand';
  
  const [selectedColor, setSelectedColor] = useState('Black');
  const [selectedSize, setSelectedSize] = useState('M');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const product = {
    id: productId,
    name: "Premium Formal Suit",
    price: "$899",
    description: "Experience the epitome of sophistication with our premium formal suit. Crafted from the finest materials with meticulous attention to detail, this suit features a modern slim-fit design that ensures both comfort and style. Perfect for business meetings, formal events, and special occasions.",
    images: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&h=600&fit=crop"
    ],
    colors: ['Black', 'Navy', 'Charcoal', 'Brown'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    features: [
      "100% Premium Wool",
      "Slim Fit Design",
      "Two-Button Closure",
      "Fully Lined",
      "Dry Clean Only"
    ]
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    toast.info(`Selected color: ${color}`);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    toast.info(`Selected size: ${size}`);
  };

  const handleBuyNow = () => {
    toast.success(`Admin notified: Customer considering ${product.name} in ${selectedColor}, size ${selectedSize}`);
    navigate('/checkout', { 
      state: { 
        product: { 
          ...product, 
          selectedColor, 
          selectedSize,
          brandName 
        } 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate(-1)}
              variant="ghost" 
              className="text-white hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-amber-500" />
              <h1 className="text-2xl font-bold text-white">MenStyle</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-slate-700">
              <img 
                src={product.images[currentImageIndex]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    currentImageIndex === index 
                      ? 'border-amber-500' 
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <span className="text-amber-400 font-medium">{brandName}</span>
              <h1 className="text-3xl font-bold text-white mt-2">{product.name}</h1>
              <p className="text-3xl font-bold text-amber-500 mt-4">{product.price}</p>
            </div>

            <p className="text-slate-300 leading-relaxed">{product.description}</p>

            {/* Color Selection */}
            <div>
              <h3 className="text-white font-semibold mb-3">Color: {selectedColor}</h3>
              <div className="flex space-x-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      selectedColor === color
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-white font-semibold mb-3">Size: {selectedSize}</h3>
              <div className="flex space-x-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      selectedSize === size
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-3">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-slate-300 flex items-center">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Buy Now Button */}
            <Button 
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-4 text-lg"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
