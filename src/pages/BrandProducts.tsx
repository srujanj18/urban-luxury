
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from 'lucide-react';

const BrandProducts = () => {
  const { brandId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const brandName = location.state?.brandName || 'Brand';

  const products = [
    {
      id: 1,
      name: "Classic Dress Shoes",
      price: "$299",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
      category: "Footwear"
    },
    {
      id: 2,
      name: "Premium Formal Suit",
      price: "$899",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop",
      category: "Suits"
    },
    {
      id: 3,
      name: "Luxury Watch",
      price: "$1299",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop",
      category: "Accessories"
    },
    {
      id: 4,
      name: "Leather Belt",
      price: "$149",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=400&fit=crop",
      category: "Accessories"
    },
    {
      id: 5,
      name: "Formal Blazer",
      price: "$499",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
      category: "Suits"
    },
    {
      id: 6,
      name: "Silk Tie Collection",
      price: "$89",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop",
      category: "Accessories"
    }
  ];

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`, { state: { brandName } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="ghost" 
              className="text-white hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-amber-500" />
              <h1 className="text-2xl font-bold text-white">{brandName}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{brandName} Collection</h2>
          <p className="text-slate-300">Discover our premium selection of formal wear and accessories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card 
              key={product.id}
              className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => handleProductClick(product.id)}
            >
              <CardContent className="p-4">
                <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-xs text-amber-400 font-medium">{product.category}</span>
                  <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                  <p className="text-2xl font-bold text-amber-500">{product.price}</p>
                </div>
                <Button className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BrandProducts;
